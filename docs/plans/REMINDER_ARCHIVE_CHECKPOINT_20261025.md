# Reminder archive checkpoint — 25 October 2026

Deleted bills and recurring expenses are excluded by the reminder collector. Deleted budgets are excluded by shared budget warning calculation. Live records still generate their existing reminders. RED 6ae1a4ad reproduces all three ghost reminders against real collector code transpiled with deterministic native-independent adapters.

Validation: all 732 mobile tests and 19 notification tests pass; typecheck passes. Evidence: .artifacts/reminder-archive-{tests,focused,types}.log. Native OS cancellation/delivery, timezone boundaries and device accessibility acceptance are not established by these tests. Existing delivered-notice history is unchanged. No production configuration, data or billing was changed; full product acceptance remains open.
