# Camera-first capture and splash — Android code 15

The owner reports automatic old-draft/image hydration on entry, delayed processing
feedback after capture, the Expo grid placeholder at startup, and rejection of an
upside-down library image on code 14. ADB confirms code 14. The latest assisted
rejection at 14:05 ICT completed in 2,515ms with a table crop, so it is not accepted
as an orientation/performance success merely because the SDK returned text.

## Changes and validation

- Capture opens camera before journal/image hydration, including when the route
  gains focus again. `Mở bản nháp` explicitly restores the existing encrypted
  draft. Owner changes invalidate work; an image/picker cancellation retains the
  durable old draft. Background orphan cleanup runs after work, outside entry.
- Show processing before the image preview and launch native OCR concurrently
  with encrypted image persistence. A complete draft cannot be handed off until
  both finish. Storage failures keep financial fields unavailable; no plaintext
  durable image or silent overwriting of old drafts is introduced.
- Camera keeps original JPEG bytes using Expo Camera skipProcessing; the native
  OCR session normalizes EXIF orientation. No manual rotate action is added.
- If full-resolution text is confidently upright, missing thumbnail direction
  alone does not reject it. Explicit non-upright text remains rejected.
- If the payable total is absent and at least two observed VAT summary labels
  establish a bounded band, read that band once and merge only a parsed amount.
  Existing subtotal + tax arithmetic guard still applies; no total is guessed.
  There is at most one summary crop plus one product-table crop, inside the
  existing budget; full-image OCR is not repeated.
- Explicit expo-splash-screen configuration uses existing Picket artwork, contain
  resize, 200dp image width and cream background. Native generated splash theme,
  images and Activity registration are brought in line with the installed plugin.
  This removes the default grid and stretched window-background bitmap.
- Aggregate-only metrics report persistence/recognition timings and eligibility
  flags, never image/text/account/key content.

RED checkpoints: deb0982f, fd4ea86f, d322811b. Behavioral component tests cover
camera entry, explicit restore, immediate feedback/concurrent work and refocus;
core tests cover summary bounds, checked total recovery and missing direction.
Final mobile suite before packaging: 844/844 PASS; focused metric follow-up PASS;
lint 0 errors / 27 existing warnings; TypeScript PASS.

The owner explicitly requests the newest signed APK on landing production.
Build and verify code 15 APK/AAB, keep immutable release backups, then update only
production APK links/metadata while preserving the existing live page design and
previous downloads. Physical code-15 inverted accuracy and camera/splash acceptance
remain pending; do not claim them from unit tests or code-13/14 measurements.
