# Learning draft completion cleanup — 25 October 2026

The learning preview now conditionally clears the exact quiz draft submitted for completion/review. Owner-serialized cleanup checks lesson, version and every answer after earlier queued writes settle. A different or newer draft is preserved; absent drafts are no-ops; unknown schemas still fail without writes. Snapshot input is validated and copied at dispatch. Existing explicit clear remains available.

RED a08c067c; 52 learning tests and all 742 mobile tests pass. Typecheck and Android JavaScript export pass. Evidence: .artifacts/learning-draft-cleanup-{focused,tests,types,export}.log. Tests verify the storage queue contract; no native lesson-navigation acceptance is claimed. The curriculum remains an unpublished development preview, pending independent review. No paid service or personal-answer cloud grading was enabled.
