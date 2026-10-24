# Live forecast observation checkpoint — 24 October 2026

This is a development-preview increment, not production or real-panel acceptance.

## User flow

1. In the cashflow preview, load a fresh cloud ledger snapshot, select wallets
   and review payment links. Save the scheduled forecast explicitly.
2. Open saved comparisons from the scenario screen, including offline. Amounts
   are hidden initially. Expand one saved forecast to inspect its scope and dates.
3. After a UTC day ends, enter the combined closing balance for all wallets in
   that saved scope and explicitly confirm that it was checked.
4. Missing days remain unknown. Only all 7/30 confirmed closing balances produce
   MAE and missed/false negative-balance-day counts for that saved forecast.
5. Corrections preserve prior confirmed values and timestamps; the original
   prediction and assumptions do not change. Individual/all-case deletion has
   explicit confirmation and stale-version checks.

The screen supports vi/en, signed integer minor units, negative/zero balances,
offline loading, retry, paged cases and scope-unavailable states. A missing wallet
blocks new confirmations rather than guessing which historical scope it represented.
Amounts and low-balance metrics hide together. Backgrounding closes details and
clears the sensitive input; interrupted operations cannot leave the busy state stuck.

## Frozen data and limits

- Capture keeps the **actual** ledger `asOf`, with at most 60 seconds of age and
  5 seconds of positive server/device clock skew. The first forecast day may be
  partial. It is not relabeled as a midnight origin or a full 24-hour first day.
- Verified wallet opening facts, scoped schedules and payment evidence feed the
  existing F0 engine. Pending device writes, stale/changed evidence and invalid
  dates/currencies/amounts reject before acknowledging capture.
- Stored data contains selected wallet IDs, source time/count, opening amount,
  explicit occurrences, versioned predicted path and user-confirmed outcomes.
  Full ledger rows, wallet names, notes and receipt contents are not retained.
- The existing encrypted offline cache backs one owner-scoped document. Writes
  serialize; duplicate taps reuse the same source/assumptions. Save success follows
  persistence. Corrupt data rejects rather than being silently reset.
- Bounds: 50 cases, 1,000 occurrences per case, 300 recorded corrections per case.
  Capacity never evicts a prior capture automatically. These cases are not included
  in backup or cloud sync; the UI states that limitation.

Closing balances and their timestamps are user/device supplied. They are not
bank-verified ground truth, independently complete finances, calibrated confidence
or permission to spend. Local timestamp validation cannot establish a trustworthy
device clock. Editing a confirmation remains visible in the correction history.

This collector evaluates individual saved F0 paths with `evaluateForecast`. It
does not manufacture the complete frozen ledger/classification artifacts required
by the separate midnight-origin F0/F1 offline runner. No automatic export, provider
request, model promotion, financial write or F1 activation is added.

## Evidence and remaining release gates

RED checkpoint: `ad2ca5c`. Full mobile suite: 595 passed; typecheck and Android JS
export passed. Lint has zero errors and the same 25 existing warnings. Focused
capture/store coverage: 100% lines, 87.33% branches, 98.59% functions. Logs are
`.artifacts/mobile-observation-tests.log`, `forecast-observation-coverage.log`,
`mobile-observation-types.log`, `mobile-observation-lint.log` and
`mobile-observation-export.log`.

Before enabling for users:

- Integrate the new resource with account-deletion/local-data purge. Per-case and
  all-case deletion are implemented here; **automatic account-deletion purge is
  not claimed**. Keep the preview gate closed until that lifecycle is verified.
- Complete native keyboard/font/TalkBack, privacy/background and session-switch
  interaction acceptance. Source guards and JS export do not substitute for it.
- Collect an authorized longitudinal panel, capture reviewed F1 histories and
  lock cohort/holdout policies before claiming predictive quality. Existing F1
  and provider gates remain unchanged.

The route and capture controls require a development build, the existing cashflow
cloud preview flag and the matching signed-in owner. Production data/configuration
and provider credentials were not changed.
