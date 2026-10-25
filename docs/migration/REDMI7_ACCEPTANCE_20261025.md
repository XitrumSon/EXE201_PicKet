# Redmi 7 acceptance — 25 October 2026

Device: Redmi 7, Android 10 / SDK 29. Installed Picket: `com.picket.mobile`,
1.0.4 / versionCode 7, installer `com.android.vending`. These results apply to
the installed artifact; later source commits require a new artifact and regression.

## Method

The owner operates the phone. ADB supplies selected UI hierarchy evidence.
scrcpy mirroring starts, but Codex's Windows automation helper is unavailable;
MIUI input injection is also unavailable. Passwords and biometric data are not
recorded. No purchase, financial write, cloud OCR submission or app-data removal
was performed in these checks.

## Observed results

| Case | Result | Evidence and limit |
| --- | --- | --- |
| Profile version footer | PASS | Visible, reachable `1.0.4 (7)` above bottom navigation; `redmi-profile-footer.xml/.png`. |
| Enable application lock | PASS | Owner authenticated with fingerprint; switch checked in `redmi-lock-enabled.xml`. Cancellation while initially enabling remains untested. |
| Return after background | PASS at tested interval | Owner waited at least 40 seconds; hierarchy shows lock heading/Unlock and no finance navigation, `redmi-locked-after-background.xml`. Source grace period is 30 seconds. The earlier five-second instruction was insufficient and is not a failure. |
| Cancel unlock | PASS | Owner cancelled native authentication; lock and zero finance navigation remain, `redmi-lock-cancel.xml`. |
| Retry unlock successfully | PASS | Owner reports fingerprint success and Wallet/Transactions open. Later hierarchy independently confirms unlocked navigation, with Budget then selected; `redmi-unlocked-transactions.xml`. |
| Camera preview | PASS for preview | Owner confirms clear preview and reachable shutter; hierarchy exposes capture/gallery/close, `redmi-camera-preview.xml`. No general OCR-quality claim. |
| Reject non-receipt image | PASS for tested image | Explicit rejection message; merchant/amount, attachment and final handoff disabled in `redmi-invalid-receipt-result.xml`. Supersedes the owner's initial impression that saving was available. No save was attempted. |

Evidence files are local under `.artifacts/` and are not committed.

## Open findings and next checks

- Play-installed code 7 displays the APK self-update section; review release-variant
  provenance before publishing another Play artifact.
- Billing cards inspected on code 7 lacked a visible price while purchase buttons
  were enabled. Source now checks a priced offer; installed-artifact verification
  of that fix is pending. No purchase button was pressed.
- Genuine-receipt OCR accuracy, editing/retry, offline capture, native backup,
  cold-start lock, update continuity and actual sandbox purchase lifecycle remain
  open. Current step: owner captures a clear genuine receipt using local OCR only,
  compares total/date, and stops before saving.

This session does not establish full release acceptance.
