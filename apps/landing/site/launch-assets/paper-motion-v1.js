import { addDemoExpense, emptyDemo, demoBudget } from './paper-motion-state.js';

const root = document.documentElement;
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
let pointerFrame = 0;
const scene = document.querySelector('[data-paper-scene]');
function resetScene() {
  for (const name of ['--drift-x', '--drift-y', '--tilt-x', '--tilt-y']) scene?.style.removeProperty(name);
}
function syncMotion() {
  paused = preference.matches;
  root.dataset.motion = paused ? 'paused' : 'running';
  if (paused) resetScene();
}
preference.addEventListener('change', syncMotion);
syncMotion();

// Preserve semantic anchors/no-JS fallback; normal in-page navigation keeps a clean URL.
function sectionForHash(hash) {
  if (!hash || hash === '#') return null;
  try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
  catch { return null; }
}
function scrollToSection(target, smooth) {
  target.scrollIntoView({ behavior: smooth && !paused ? 'smooth' : 'instant', block: 'start' });
  const needsTabIndex = !target.hasAttribute('tabindex');
  if (needsTabIndex) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
}
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
  const target = sectionForHash(anchor.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  scrollToSection(target, true);
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
});
const initialSection = sectionForHash(location.hash);
if (initialSection) requestAnimationFrame(() => {
  scrollToSection(initialSection, false);
  history.replaceState(history.state, '', location.pathname + location.search);
});

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
if (scene && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  scene.addEventListener('pointermove', event => {
    if (paused || pointerFrame) return;
    const bounds = scene.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (paused) return;
      scene.style.setProperty('--drift-x', `${x * 10}px`);
      scene.style.setProperty('--drift-y', `${y * 6}px`);
      scene.style.setProperty('--tilt-x', `${-y * 3}deg`);
      scene.style.setProperty('--tilt-y', `${x * 5}deg`);
    });
  }, { passive: true });
  scene.addEventListener('pointerleave', resetScene);
}

const story = document.querySelector('[data-story]');
if (story) {
  const controls = [...story.querySelectorAll('[data-story-select]')];
  const steps = [...story.querySelectorAll('[data-story-step]')];
  const frames = [...story.querySelectorAll('[data-story-frame]')];
  let manualUntil = 0;
  const select = index => {
    story.dataset.current = String(index);
    controls.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    frames.forEach((frame, i) => { frame.classList.toggle('is-active', i === index); frame.setAttribute('aria-hidden', String(i !== index)); });
  };
  controls.forEach((button, i) => {
    button.disabled = false;
    button.addEventListener('click', () => { manualUntil = performance.now() + 1600; select(i); });
  });
  if ('IntersectionObserver' in window) {
    const visible = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      if (!matchMedia('(min-width: 761px)').matches || performance.now() < manualUntil) return;
      let best = -1, ratio = 0;
      steps.forEach((step, i) => { if ((visible.get(step) ?? 0) > ratio) { best = i; ratio = visible.get(step); } });
      if (best >= 0) select(best);
    }, { rootMargin: '-25% 0px -25% 0px', threshold: [0, .1, .25, .5, .75, 1] });
    steps.forEach(step => observer.observe(step));
  }
  select(0);
}

const paper = document.querySelector('[data-demo-paper]');
if (paper) {
  let state = emptyDemo();
  const money = amount => `${new Intl.NumberFormat('vi-VN').format(amount)} ₫`;
  const meter = paper.querySelector('[data-demo-meter]');
  const render = () => {
    const remaining = demoBudget - state.total;
    paper.querySelector('[data-demo-balance]').textContent = money(remaining);
    paper.querySelector('[data-demo-subtitle]').textContent = state.count ? `${state.count} khoản chi trong ví dụ hôm nay.` : 'Chưa có khoản chi nào trong ví dụ.';
    paper.querySelector('[data-demo-last]').textContent = state.last?.label ?? 'Chọn một khoản để thử';
    paper.querySelector('[data-demo-total]').textContent = `Đã chi: ${money(state.total)}`;
    paper.querySelector('[data-demo-status]').textContent = state.last ? `${state.last.label}: ${money(state.last.amount)}. ${remaining >= 0 ? 'Còn lại' : 'Vượt khoảng dành'} ${money(Math.abs(remaining))}.` : 'Ghi thử để thấy khoản nhỏ cộng lại thế nào.';
    meter.setAttribute('aria-valuenow', String(Math.min(state.total, demoBudget)));
    meter.setAttribute('aria-valuetext', `Đã chi ${money(state.total)} trên ${money(demoBudget)}`);
    meter.style.setProperty('--spent', String(Math.min(state.total / demoBudget, 1)));
    paper.classList.toggle('is-over-budget', remaining < 0);
  };
  document.querySelectorAll('[data-demo-add]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      state = addDemoExpense(state, button.dataset.demoAdd);
      render();
      if (!paused) {
        paper.classList.remove('just-added');
        requestAnimationFrame(() => paper.classList.add('just-added'));
      }
    });
  });
  paper.addEventListener('animationend', () => paper.classList.remove('just-added'));
  const reset = paper.querySelector('[data-demo-reset]');
  reset.disabled = false;
  reset.addEventListener('click', () => { state = emptyDemo(); render(); });
}
