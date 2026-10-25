# Learning draft completion cleanup — 25 October 2026

The learning preview now conditionally clears the exact quiz draft submitted for completion/review. Owner-serialized cleanup checks lesson, version and every answer after earlier queued writes settle. A different or newer draft is preserved; absent drafts are no-ops; unknown schemas still fail without writes. Snapshot input is validated and copied at dispatch. Existing explicit clear remains available.

RED a08c067c; 52 learning tests and all 742 mobile tests pass. Typecheck and Android JavaScript export pass. Evidence: .artifacts/learning-draft-cleanup-{focused,tests,types,export}.log. Tests verify the storage queue contract; no native lesson-navigation acceptance is claimed. The curriculum remains an unpublished development preview, pending independent review. No paid service or personal-answer cloud grading was enabled.

## Learning screen save lifetime continuation
The development learning session synchronously serializes completion/review saves. Navigation, retry and answer controls expose disabled state while saving and captured callbacks also respect the synchronous lock. Lesson selection waits for draft hydration. An unmounted session stops follow-up enqueue/completion UI feedback and conditional draft cleanup after an awaited completion; an already-dispatched persistence operation is not cancelled. Existing conditional draft matching remains.

RED 0f6b3795 reproduces duplicate saves, navigation during persistence and late cleanup. Four real screen callback tests with hook/transport adapters cover those cases plus hydration ordering. All 753 mobile tests and 56 learning tests pass; typecheck and Android JS export pass. Evidence: .artifacts/learning-screen-races-{tests,focused,types,export}.log. No native rendering/TalkBack, published curriculum or full product completion is claimed.
