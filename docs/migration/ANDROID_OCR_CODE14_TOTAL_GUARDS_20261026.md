# Receipt total guards — Android code 14

The code-13 upright Redmi scan completed in 2,647ms, and the owner confirmed
correct total with product details. A distinct 180-degree camera capture then
completed in 2,711ms but selected a contact phone number as the payable total,
used the generic VAT heading as merchant, and retained five product rows.
Post-second-scan total PSS was 362,200KiB (versus 398,635KiB after the first scan);
these two snapshots do not establish long-run leak freedom. Inverted accuracy
was not accepted despite improved latency.

## Fix and verification

- Exclude payment-method/contact lines from both total joining and total scoring.
  Keep the checked VAT arithmetic total; do not infer money from a phone number.
- Exclude generic `Giá trị gia tăng` headings from merchant candidates.
- Preserve rejection of inconsistent quantity × unit-price / row-total cells.
  Attach an internal review issue so the UI explicitly warns that conflicting
  product rows were omitted and require checking, rather than suggesting a
  complete list. No price correction is guessed.
- The actual newly captured photo stays local/ignored. Replaying its native OCR
  records against the final parser selects the printed total and actual seller;
  raw-text reparse preserves that total. Five paid product rows remain. One paid
  row has conflicting recognized prices, and zero-price rows remain unreadable.
  Do not claim complete eight-row extraction or whole-product acceptance.
- Native processing code and production 20-second/15-second budgets are unchanged;
  this adds no OCR pass. An ignored accuracy-only diagnostic used longer SDK
  waits on a freshly booted emulator under heavy background load. Its timings
  must not be used as production performance evidence.

RED checkpoints: 5cdd8221 (three total/merchant regressions), 784bc3cd (explicit
omitted-row warning). GREEN: 2a9a0e52. Final mobile suite 833/833 PASS; lint exits
successfully with 0 errors / 27 existing warnings; TypeScript check PASS.
Checkpoint 5cdd8221 also inadvertently included pre-staged transactions/index.tsx
changes; their content was preserved. Later commits explicitly limit file scope.
No GitHub push was performed.

Signed release build, artifact and Internal rollout evidence will be appended
when verified. Redmi code-14 acceptance remains pending; do not infer it from
recorded-data checks. No receipt transaction is created by these diagnostics.
