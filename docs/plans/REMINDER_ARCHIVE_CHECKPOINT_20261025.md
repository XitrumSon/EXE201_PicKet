# Reminder archive checkpoint — 25 October 2026

Deleted bills and recurring expenses are excluded by the reminder collector. Deleted budgets are excluded by shared budget warning calculation. Live records still generate their existing reminders. RED 6ae1a4ad reproduces all three ghost reminders against real collector code transpiled with deterministic native-independent adapters.

Validation: all 732 mobile tests and 19 notification tests pass; typecheck passes. Evidence: .artifacts/reminder-archive-{tests,focused,types}.log. Native OS cancellation/delivery, timezone boundaries and device accessibility acceptance are not established by these tests. Existing delivered-notice history is unchanged. No production configuration, data or billing was changed; full product acceptance remains open.

## Reminder local month continuation
The notification screen, coordinator and reminder collector now select the device-local calendar month, matching planning rather than switching on UTC. RED 9d0134bc reproduces the October-local/September-UTC boundary in all three consumers. All 733 mobile tests and 20 notification tests pass; typecheck passes. Evidence: .artifacts/reminder-month-{tests,focused,types}.log. Existing transaction stored month-key rules are unchanged. This does not provide an automatic midnight/background clock refresh or certify native timezone behavior. User theme edits were preserved outside the staged screen change.

## Reminder priority continuation
The native scheduling batch now selects the earliest 50 future notification times instead of the first 50 collection rows. Sorting uses the filtered copy and preserves caller input. RED 973264be reproduces the omitted nearest reminder among 51 reverse-ordered items using real scheduleNow code and an OS adapter. All 734 mobile tests and 21 notification tests pass; typecheck passes. Evidence: .artifacts/reminder-priority-{tests,focused,types}.log. The existing 50-item cap remains; background replenishment and native delivery acceptance are not established by this increment.
