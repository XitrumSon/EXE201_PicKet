# Receipt OCR performance — Android code 13

26 October 2026. Code 12 is not accepted: the owner reports 60–120+ second
scans and upright/inverted failures. This update replaces its repeated full-image
rotation/OCR pipeline. Redmi acceptance remains pending until code 13 is tested.

## Implementation

- Local Expo Android module decodes a bounded source once (maximum 16M decoded
  pixels), normalizes EXIF, and owns one ML Kit recognizer per scan. Work runs off
  the UI thread. No intermediate PNG files or cloud upload.
- A thumbnail bounded to 960px finds text direction. Weighted agreement between
  text-line angles selects one cardinal correction. Thumbnail text never supplies
  financial fields. Read the selected full-resolution image once; refine at most
  one identified table band. Preserve the full-image total when merging details.
- A 20-second processing budget stops further stages. Individual SDK awaits are
  bounded to 15 seconds or remaining budget. SDK tasks cannot safely be forcibly
  cancelled: timed-out work retains its pixels until completion, rejects overlap,
  and releases the recognizer/bitmaps afterward. This is not a hard wall-clock
  cancellation guarantee for decode, SDK cleanup, or bridge scheduling.
- Owner changes and leaving capture abort subsequent work. Memoize receipt
  eligibility rather than reparsing on every form edit. Cache table column/nearest
  row matching outside nested product loops.
- Logs contain aggregate stage duration/pixel counts only, never receipt text,
  account IDs, local image paths or keys. Generated module output is ignored.

## Evidence and limits

- Synthetic parser fixture: 606 OCR lines, 150 table rows, existing 100-item cap.
  Five-run host median improved from 142.67ms to 6.04ms. This is parser time,
  not device OCR latency.
- Android 35 emulator, 2 cores/2GB: exact production Java image session, bundled
  ML Kit 16.0.1, same locally authorized 3000x4000 invoice and an actual 180-degree
  rotated fixture. A combined diagnostic avoids ADB round trips between stages;
  its table band matches the production TypeScript crop for this fixture.
  Upright: 15,506ms (direction 1,718 / full 8,859 / crop 4,662).
  Inverted: 15,083ms (direction 1,637 / full 8,384 / crop 4,787).
  Both select the correct correction, preserve the printed total, recover six
  paid product rows and close native resources. Private inputs/text stay ignored.
- Separate production TypeScript-to-Java RPC checks verify orchestration/merge,
  but ADB transport overhead can exhaust the 20-second budget and omit detail.
  Those are not phone/Expo latency measurements. Do not claim every run <20s.
- Earlier full-image direction experiment timed out on inverted inputs and is
  superseded by the thumbnail-only direction pass.
- Two zero-price/unreadable rows and the purchase date are still not reliably
  read from this sample. Do not fabricate them or mark full OCR acceptance done.

## Validation and release

RED checkpoints: c298c68e, f74c4709, e121780c, 21377d60. Focused tests cover
cardinal direction, one full read/one optional crop, abort, budget exhaustion and
cleanup. Final suite/build/release evidence is appended after verification.

Before acceptance, update Redmi through Internal testing, confirm code 13 opens,
then scan the same upright and 180-degree invoice. Check timing, responsiveness,
product rows, totals, date warning, retake handling, and repeated-scan memory.
Do not uninstall or clear app data. No production rollout is implied.
