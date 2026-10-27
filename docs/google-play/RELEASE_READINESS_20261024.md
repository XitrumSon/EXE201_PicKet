# PicKet Google Play release readiness — 24 October 2026

<!-- project-status-link -->
> Đồng bộ tài liệu 27/10/2026: [Trạng thái hiện hành](../PROJECT_STATUS.md). Báo cáo/kế hoạch này giữ phạm vi và bằng chứng tại checkpoint được ghi trong tài liệu. Các mục chưa làm và phiên bản cũ cần đối chiếu với hiện trạng chung.

## Completed in this increment

- Four subscription products and VN base plans created successfully in DRAFT state at the owner-approved prices in `subscriptions.json`. Read/create permission is now working after the owner updated permissions and created a payments profile.
- VI and EN store copy prepared in `store-listings.json`; no unimplemented learning/AI promises.
- `verify-purchase` and `play-notifications` deployed to project `qyokoyopodjtvfyunyde` after Deno type checks passed.
- Remote checks: GET returns 405 for both functions; unauthenticated purchase verification returns 401; unconfigured RTDN returns 503. These checks do not prove purchase or renewal handling.
- Existing remote purchase table and recording function inspected; no purchase rows written.

## Blocking configuration

1. Play permissions and payments-profile creation are now resolved for creating draft subscriptions. Payout bank details and any remaining tax/verification obligations are handled by the owner in Console.
2. Google Cloud Pub/Sub list topics and subscriptions both return 403 for this account. RTDN topic/subscription and push identity have not been verified or created. Use a dedicated push identity and Google OIDC; do not expose an unauthenticated webhook.
3. Owner added `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` in Dashboard. Its stored digest matches the locally validated service-account JSON. No private credential was printed. A real test purchase is still needed to validate the complete verifier path.
4. RTDN secrets needed after push configuration: `GOOGLE_PLAY_RTDN_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PLAY_RTDN_AUDIENCE`. Audience must match the configured push OIDC audience.
5. Support email confirmed: `picketfinance@gmail.com`. Privacy and deletion pages deployed and checked HTTP 200; paths `/privacy.html` and `/account-deletion.html` on the production landing domain. Public legal entity/developer identity must remain consistent with the owner’s verified Console profile.

## Before public release

- Create the four exact IDs, configure VN base plans with approved prices, and verify Play's tax-inclusive displayed prices. Enable only the intended countries; do not invent global prices.
- Configure license testers and a test track. Run the S01–S14 matrix in `../GOOGLE_PLAY_SANDBOX_TO_PRODUCTION.md` using test payment methods. Do not label ordinary purchases as sandbox.
- Complete Data safety, app access, content rating, target audience, ads and financial-feature declarations based on the release artifact and actual services. Some declarations are Console-only and are not exposed by the Android Publisher MCP.
- Upload real screenshots and prepared store graphics. Privacy/deletion pages are now public and verified. Store metadata is not yet committed because Google requires automatic review on commit for this app.
- Closed-test alpha currently has a draft version code 6; internal testing has version code 7. Do not claim that a draft is a running closed test. Validate a suitable build before starting the closed test.
- If Console applies the personal-account gate: at least 12 opted-in testers for 14 continuous days, then apply for production access. No invented testers, usage evidence or readiness answers.
- Do not enable new purchases or production rollout until configuration and sandbox checks pass.

References: [Google Play permissions](https://support.google.com/googleplay/android-developer/answer/9844686), [create subscriptions](https://developers.google.com/android-publisher/api-ref/rest/v3/monetization.subscriptions/create), [personal-account testing](https://support.google.com/googleplay/android-developer/answer/14151465).

## Further evidence in this increment

- Public legal pages checked at 390px viewport, no horizontal overflow; screenshot inspected. Caddy validated and reloaded, with timestamped rollback copies on the VPS. Existing login and release metadata URLs remain HTTP 200.
- Landing build and 10 tests passed. Mobile TypeScript passed; lint: zero errors and 25 pre-existing warnings.
- Billing restore bug fixed: failed verification no longer becomes a blanket successful restore. Billing suite: 6 passed, including total and partial failure cases. This source change is not yet in an uploaded AAB.
- Icon 512×512 and feature graphic 1024×500 prepared and visually inspected under `.artifacts/google-play-assets/`. They reuse the existing brand asset; not yet committed to Play.
- Store metadata validation passed, but Google rejects `changesNotSentForReview=true` for this app. The edit was discarded; store descriptions/contact are prepared locally, not falsely reported as published.

- Latest Pub/Sub topics read still returns 403; Google Cloud permissions remain unresolved. Do not confuse Play Console administrator with Cloud IAM.

## RTDN configuration progress

- Pub/Sub API enabled by owner; topics API now returns 200.
- Created `projects/picket-510311/topics/picket-play-rtdn` and granted `roles/pubsub.publisher` on that topic to `google-play-developer-notifications@system.gserviceaccount.com`, preserving existing IAM bindings/etag.
- Supabase configured with the expected push identity `picket-rtdn-push@picket-510311.iam.gserviceaccount.com` and exact webhook URL as OIDC audience. Unauthenticated POST returns 401 after configuration.
- Dedicated keyless push identity does not exist yet. Creating it is blocked because IAM API is disabled; Pub/Sub Admin does not grant IAM service-account creation/policy administration.
- Owner Cloud Shell script `setup-rtdn-identity.sh` prepares that identity and narrowly scoped actAs/token-signing permissions. No service-account key or project Owner grant is needed.
- Push subscription, Google Play topic setting and delivery test remain pending.

## Authenticated push delivery verified

- Owner completed IAM API / dedicated push service-account setup.
- Created `projects/picket-510311/subscriptions/picket-play-rtdn-push`, targeting the configured Supabase endpoint with Google OIDC. Audience and service-account email match the handler configuration. Retry backoff 10–600 seconds, ack deadline 30 seconds, message retention 7 days.
- Published a synthetic `testNotification` without any purchase token or financial payload. Publish returned 200, message ID `22471053140210214`.
- Supabase function-edge logs show one request from Google (`APIs-Google`) to `/functions/v1/play-notifications` returning 200. The unauthenticated Python check returned 401. Thus the Pub/Sub-to-Supabase authentication/delivery path passed; this is not a subscription lifecycle test.
- Still needed: save `projects/picket-510311/topics/picket-play-rtdn` in the app’s Play Console RTDN settings and use Send Test Message, followed by actual license-tester purchases/renewals/cancellation acceptance.

## Console completion increment

- Owner exported the current Data safety CSV. It contained collection=true but zero selected data types. Preserved email/password, OAuth and the account deletion URL; selected and completed 11 actual data categories, including ML Kit diagnostics/installation identifiers and coarse IP-derived location present in infrastructure metadata. CSV structural validation passed; `applications.dataSafety` returned success (`{}`). API receipt and SHA-256 saved in `data-safety-submission-20261024.json`; Google approval is not claimed.
- Privacy page updated to match SDK and coarse-location disclosures, deployed to VPS.
- Store descriptions VI/EN, contact email/website, 512px icon and 1024×500 feature graphic committed successfully with a normal edit commit after validation. Earlier no-review mode was unsupported; no release track was changed. Receipt: `store-metadata-submission-20261024.json`.
- Category cannot be set with the current Android Publisher AppDetails API (only contactEmail, contactPhone, contactWebsite and defaultLanguage supported). Owner still needs to select Finance in Console.
- Phone screenshot preparation remains incomplete. Command to start a fresh emulator and download the Play-signed APK was rejected by automatic approval (“blocked by policy”). No screenshot from that operation was fabricated or uploaded. Two current, non-sensitive phone screenshots are still needed.

## Trạng thái xác minh lại 27/10/2026

Phần này thay thế các trạng thái code 7/thiếu screenshot ở checkpoint cũ.

- Internal hiện là **1.0.5/code 18**, completed, rollout 100%; AAB đã upload và đọc lại track độc lập.
- AAB release build PASS, jarsigner verified; manifest Play không có REQUEST_INSTALL_PACKAGES/SYSTEM_ALERT_WINDOW. SHA-256 `ed7fc185bfa34fd85c4ba592285eec5ba96ddfb11a1b608a0294d73a03622526`.
- Listing VI đã có **7 phoneScreenshots** qua API, không còn thiếu hai ảnh theo checkpoint 24/10. Chưa tuyên bố ảnh cũ phản ánh đầy đủ giao diện Paper mới.
- Bốn subscription base plan vẫn DRAFT. Alpha code 6 draft; beta/production trống.
- API alpha/internal google_groups rỗng; không dùng kết quả đó để suy ra danh sách email/license testers.
- Chưa có bằng chứng lifecycle sandbox, RTDN Send Test Message từ Play hoặc Console-only declarations đã hoàn tất. Browser connector không có Chrome khả dụng trong lượt này.
- Google OAuth trên Pixel 5 code 18 đã sign out/sign in qua tài khoản có sẵn và giữ phiên sau cold restart.

Receipt: `.artifacts/completion-20261027/play-code18-deploy.json`; [báo cáo thực thi](../migration/PROJECT_COMPLETION_20261027.md).

## Checkpoint 1.0.6/code 19, ngày 27/10

Internal đã cập nhật code 19, đọc lại **completed, rollout 100%**. Alpha code 6 vẫn draft theo yêu cầu chủ dự án; beta/production trống. AAB 57.589.855 byte, jarsigner verified, cùng certificate với direct APK; không có quyền cài APK/overlay. SHA-256 `5657a802596f94eb423ec58136df6c605348104f81800089676234d5d15df15e`.

Landing cũng đã phát hành APK code 19 và được tải lại kiểm checksum trên cả hai domain. [Báo cáo phát hành và bằng chứng](../migration/ANDROID_RELEASE_1_0_6_20261027.md). Các gate Billing/Console/thiết bị thật phía trên vẫn giữ đúng trạng thái; upload thành công không thay thế chúng.

## Hiện trạng sau phát hành 1.0.7/code 20

### Cập nhật danh mục thanh toán 27/10/2026

#### Kết quả kiểm thử Billing sau kích hoạt

**Cập nhật Console sau đăng nhập 27/10:** đã đọc danh sách Internal testing `Picket Internal` gồm 3 tài khoản và chọn chính danh sách hiện có trong Manage account → Play settings → License testing. Đã xác nhận Save, tải lại URL độc lập và thấy `Picket Internal` checked, 3 users, response `RESPOND_NORMALLY`, không còn thay đổi chưa lưu. Không ghi email cá nhân vào Git. Trạng thái này thay thế phần chưa xác minh license tester/browser trong checkpoint dưới; không thay đổi alpha/closed-test hoặc quyền quản trị Console. Mua thử, ack, restore và lifecycle chưa nghiệm thu trên Play Store; runtime mua mới vẫn cần xử lý trong môi trường kiểm thử.

- Mobile Billing: 21/21 tests đạt (purchase validation, readiness, verify-before-finish, restore/refresh, locale, race/unmount/account scope).
- Dart Billing/entitlements: 7/7 tests đạt (request/response contract, authenticated forwarding, malformed verifier response).
- Ma trận quyền gói PGlite cô lập: 22 assertions đạt cho 4 product ID, Free/Plus/Pro OCR cloud 3/30/100 mỗi cửa sổ 24 giờ, owner isolation, expiry/revoked/stale verification, strongest tier, client write denied, token hash hidden, replacement replay fence và cross-owner claim rejection. Đây là dữ liệu mô phỏng trong database cô lập, không phải purchase Google thật.
- Production: tạo một user tổng hợp dùng riêng, xác minh Free quota 3, auth required, product lạ/token rỗng bị từ chối, token Google giả trả 502 và không nâng quyền, authenticated client không gọi được record_play_purchase. Đã xóa user tạm trong finally; không ghi giao dịch hoặc cấp quyền trả phí trên production.
- `GET /v1/billing/availability` xác nhận `newPurchasesEnabled=false`. Không tự mở mua cho mọi người khi chưa có license tester/giao dịch thử. Bốn base plan đọc lại vẫn ACTIVE tại VN.
- Chưa thể nghiệm thu S01–S14 bằng Play: chưa xác minh Gmail license tester, browser inventory rỗng, Pixel 5 không chạy và cấu hình Pixel 5 hiện không có Play Store. Redmi 7 kết nối nhưng chưa có xác nhận tài khoản test; không thao tác mua bằng phương thức thật. API connector không có chức năng quản lý license testers hay tạo purchase token thử.
- Còn cần: tài khoản license tester trên thiết bị có Play Store; kết nối Console để cấu hình/kiểm tra tester và RTDN; môi trường cho phép mua thử trước khi test purchase/ack/restore/renewal/cancel/refund. ACTIVE và các tests trên chưa chứng minh thanh toán đầu cuối.

Evidence local: `.artifacts/billing-acceptance-20261027/` gồm mobile-tests.log, api-tests.log, entitlement-matrix.log và production-probe.log; không chứa token hoặc credential người dùng. Hướng dẫn đối chiếu: https://developer.android.com/google/play/billing/test?hl=en.

Theo yêu cầu chủ dự án, bốn base plan đã được kích hoạt và đọc lại độc lập bằng Android Publisher API: Plus tháng 19.000đ, Plus năm 199.000đ, Pro tháng 49.000đ, Pro năm 499.000đ. Tất cả ACTIVE, auto-renew, chỉ VN; giữ nguyên ID monthly/yearly và không thêm trial/offer. Trạng thái này thay thế DRAFT trong các checkpoint trước. Không thay release track hoặc bật runtime Billing trong lượt cấu hình danh mục. License tester, S01–S14 và RTDN vẫn cần nghiệm thu; ACTIVE không phải bằng chứng mua/verify/ack thành công.

Play Internal đã đọc lại completed với code 20; alpha vẫn code 6 draft, beta/production chưa có release. APK trên landing cùng version/code, AAB Play không có quyền cài APK. Các gate Console, Billing, thiết bị thật và nội dung cloud không tự đóng bởi upload thành công. Xem [báo cáo code 20](../migration/ANDROID_RELEASE_1_0_7_20261027.md) và [backlog hiện hành](../BACKLOG.md).
