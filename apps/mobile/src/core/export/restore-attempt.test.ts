import assert from "node:assert/strict";
import test from "node:test";
const modulePath = "./restore-attempt";

test("lost restore acknowledgement stays unconfirmed and never claims that data was unchanged", async () => {
  const { createRestoreRunner } = await import(modulePath);
  let refresh = 0;
  assert.equal(await createRestoreRunner()({ isCurrent: () => true, restore: async () => { throw Error("Lost acknowledgement"); }, refresh: async () => { refresh++; } }), "unconfirmed");
  assert.equal(refresh, 0);
});

test("confirmed restore with failed reload retries only reload and cannot submit the backup twice", async () => {
  const { createRestoreRunner } = await import(modulePath);
  const run = createRestoreRunner(); let commits = 0, refreshes = 0;
  const options = { isCurrent: () => true, restore: async () => { commits++; }, refresh: async () => { refreshes++; if (refreshes === 1) throw Error("Offline"); } };
  assert.equal(await run(options), "refresh-failed");
  assert.equal(await run(options), "restored");
  assert.equal(commits, 1); assert.equal(refreshes, 2);
});

test("restore runner rejects repeated taps and skips refresh/navigation after an account switch", async () => {
  const { createRestoreRunner } = await import(modulePath);
  const run = createRestoreRunner(); let release!: () => void, current = true, commits = 0, refreshes = 0;
  const wait = new Promise<void>(resolve => { release = resolve; });
  const options = { isCurrent: () => current, restore: async () => { commits++; await wait; }, refresh: async () => { refreshes++; } };
  const first = run(options);
  assert.equal(await run(options), "busy");
  current = false; release();
  assert.equal(await first, "session-changed"); assert.equal(refreshes, 0); assert.equal(commits, 1);
  assert.equal(await createRestoreRunner()(options), "session-changed"); assert.equal(commits, 1);
});

test("unconfirmed restore requires a new preparation before another submit", async () => {
  const { createRestoreRunner } = await import(modulePath);
  const run = createRestoreRunner(); let commits = 0;
  const options = { isCurrent: () => true, restore: async () => { commits++; throw Error("Lost"); }, refresh: async () => {} };
  assert.equal(await run(options), "unconfirmed");
  assert.equal(await run(options), "unconfirmed");
  assert.equal(commits, 1);
});
