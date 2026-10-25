# Guest planning integrity checkpoint — 25 October 2026

Completed this increment:
- Guest budget spending now shares refund/split calculation with the overview, excludes deleted rows, and uses exact integer proportional refund rounding.
- Transfers reject negative source limits, invalid limits and destination overflow. Rollover rejects invalid or excessive limits.
- Guest month close derives current live totals rather than trusting totals captured by a screen, validates metadata and rejects unsafe totals. Exact next-month UTC midnight is permitted.
- Month-close review is invalidated when ledger, allocations, budgets or limits reload. An older native confirmation cannot reuse a newer review. Deleted transactions are excluded from displayed month totals.

Validation: 716/716 mobile tests passed; focused 16/16 tests passed again after the translated review hint; mobile typecheck passed; lint has 0 errors and 24 existing warnings; Android JavaScript export passed. RED commits ff14e30 and 30bc401 preserve reproduction.

Limits: client review fencing does not establish an atomic server revision contract. Existing currency/month-key conventions and historical closes are unchanged. Native device acceptance, Google Play sandbox cycles and the required tester cohort remain outstanding. This is not final release acceptance. No production writes or paid services were activated.
