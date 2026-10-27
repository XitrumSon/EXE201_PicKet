# Trạng thái hiện hành của Picket

Cập nhật **27/10/2026, Asia/Saigon**. Đây là nguồn trạng thái chung cho mobile, web, API, Supabase và phát hành. [Mục lục tài liệu](README.md). Các báo cáo theo ngày giữ bằng chứng của lần chạy đó; danh sách pending cũ không tự động là backlog hiện tại.

## Phiên bản và môi trường

| Thành phần | Trạng thái đã xác minh |
| --- | --- |
| Mobile source/release | 1.0.7 / code 20; Paper UI thống nhất, sign-out/updater/guest splits đã sửa; native QA trước build bằng package riêng |
| Landing public | Paper có chuyển động, tương tác và footer; APK 1.0.7/code 20 ARM64, tải toàn bộ và kiểm SHA-256 PASS |
| Google Play Internal | AAB 1.0.7/code 20 đã upload 27/10; đọc lại completed, alpha draft không đổi |
| Google Play alpha | Code 6 draft; chưa phải thử nghiệm kín đang chạy |
| Google Play production/beta | Chưa có release |
| Domain landing | https://picketfinance.com |
| Domain web | https://app.picketfinance.com |
| Domain Dart API | https://api.picketfinance.com |
| Supabase | Project `qyokoyopodjtvfyunyde`; 49 migration sau cập nhật 27/10 |

Thiết kế duy nhất: [PICKET-DESIGN.md](../PICKET-DESIGN.md). Danh sách việc còn mở: [BACKLOG](BACKLOG.md). Không dùng số liệu phiên bản trong báo cáo cũ làm hiện trạng. Bản máy ảo không thay thế nghiệm thu điện thoại ARM64 hoặc Play Billing.

## Các checkpoint kiểm tra ngày 27/10

- Toàn repo: **10 landing + 908 mobile + 54 web + 140 API tests PASS**; không có mobile test bị skip.
- Mobile/web typecheck PASS. Lint toàn repo không lỗi; mobile hiện 0 lỗi/0 cảnh báo. Dart analyzer không lỗi.
- 13 bộ SQL test PASS trong PGlite sau khi áp toàn bộ migration trừ pg_cron; pg_cron được kiểm tra metadata trên Supabase thật.
- Pixel 5: đăng xuất qua UI, chọn tài khoản Google có sẵn, chọn Picket tại Android callback chooser, trở lại Home thành công. Force-stop/mở lại vẫn giữ phiên và dữ liệu cloud hiển thị. Không tạo/sửa/xóa giao dịch của tài khoản thật.
- Landing, privacy, account-deletion, web login và API health HTTPS trả 200.
- Production API synthetic acceptance PASS: ledger/schedule CRUD, retry đồng thời, stale revision, foreign-wallet rejection, settlement replay/non-resurrection; learning consent/revoke/isolation, draft lesson rejection và AI-disabled gate. Đã xóa tài khoản test; không gọi AI provider.
- Đã vá Next.js/eslint-config-next lên 16.4.3 và cập nhật dependency Zod. Web build/test/lint/typecheck PASS; npm audit không còn vulnerability. Web/API đã deploy trên VPS bằng image `completion-20261027`; runtime xác nhận Next.js 16.4.3, HTTPS smoke PASS.
- APK ARM64 1.0.6/code 19 đã xác minh chữ ký và đưa lên landing theo yêu cầu chủ dự án; bản cũ vẫn tải được. Chi tiết tại [báo cáo phát hành](migration/ANDROID_RELEASE_1_0_6_20261027.md). Thiết bị thật do chủ dự án tự nghiệm thu sau.

Log và dữ liệu kiểm tra riêng tư được giữ trong `.artifacts/completion-20261027`; không commit credential, ảnh tài khoản thật hoặc APK/AAB.

### UI Paper và landing motion — đã đóng gói/phát hành code 20

[Mobile Paper](migration/MOBILE_PAPER_UNIFICATION_20261027.md) đã nằm trong APK/AAB **1.0.7/code 20**: control/thẻ/typography gọn, cảnh báo đăng xuất theo queue thực, bỏ recheck dư và sửa chia danh mục guest. 147 ảnh QA native bao phủ 50 route; không thay thế nghiệm thu thiết bị thật.

[Landing motion](migration/LANDING_MOTION_RESEARCH_20261027.md) đã deploy production: hero giấy nhiều lớp/parallax, story đổi màn theo cuộn, mô phỏng khoản chi, tự chạy motion/reduced motion, footer và liên hệ. Không sửa giao diện `app.picketfinance.com`. 13 landing + 914 mobile tests, lint/typecheck/build PASS; Play Internal completed và tải APK đúng hash đã được đọc lại. [Báo cáo phát hành 1.0.7](migration/ANDROID_RELEASE_1_0_7_20261027.md).

## Nghiệm thu bổ sung và CI

- [Xử lý xung đột đồng bộ](migration/SYNC_CONFLICT_COMPLETION_20261027.md): đã sửa callback/race và hoàn thiện VI/EN; 15 focused tests PASS. Native fixture merge xác nhận đúng tiêu đề local/số tiền server/version 3, ảnh VI/EN đã xem, fixture đã dọn.


- [Mobile cloud CRUD/offline/owner isolation](migration/MOBILE_CLOUD_ACCEPTANCE_20261027.md) đã PASS; tài khoản Google thật được khôi phục, fixture đã xóa.
- `npm run test:db` đã được thêm vào `npm test` và job backend CI (commit `1c378641`); chạy root test local exit 0. Lệnh chuẩn chạy cả legacy SQL validation và 13 suite learning/cashflow/appearance/trigger mới; không còn chỉ kiểm nhóm migration cũ. pg_cron vẫn cần kiểm riêng trên PostgreSQL.
- Chủ dự án tự nghiệm thu thiết bị thật sau; checklist đã cập nhật code 20.

## Supabase — đã đồng bộ production

SMTP đã đổi ngày 27/10 sang `picketfinance@gmail.com`, tên gửi `Picket Production`. Đăng nhập SMTP TLS và email recovery thực đến inbox đều PASS; fixture đã xóa. Không thay đổi OAuth hoặc chính sách xác thực khác. [Báo cáo SMTP](migration/SMTP_SENDER_CHANGE_20261027.md).

Đã kiểm tra migration history, dry-run, thực thi 13 migration còn thiếu từ `20261023162639` đến `20261024120000`, rồi xác minh lại remote. Bao gồm appearance/preferences và backup, learning attempts/activity, AI consent/jobs/retention, cashflow snapshot/schedules/settlements/wallet scope.

Thêm migration `20261027052550_restrict_internal_trigger_execution.sql`: thu hồi quyền gọi trực tiếp hai trigger `enforce_maintenance` và `reject_suspended_snapshot` từ PUBLIC/anon/authenticated. Test RED tái hiện quyền thừa; GREEN xác nhận không gọi trực tiếp được và trigger bảo trì/khóa tài khoản vẫn chặn ghi đúng. Remote xác nhận quyền EXECUTE đã tắt. Tổng cộng **49 migration**.

- Tất cả bảng learning/cashflow mới bật RLS.
- Hai cron job retention/history đang active, lịch `17 * * * *` và `31 2 * * *`.
- Không có bài học được published trên cloud (`0`); migration không tự công bố nội dung hoặc bật AI.
- Không đưa seed test lên production; không thay đổi bản ghi tài chính người dùng trong lượt migration.
- Rollback: ưu tiên forward fix. Nếu API mới cần rút lại, rollback image trước; giữ bảng/cột bổ sung để bảo toàn dữ liệu. Không DROP bảng có dữ liệu hoặc sửa migration history để giả đồng bộ.

## Phạm vi tính năng đã có

- Android Expo chính thức, guest mã hóa local và tài khoản cloud; Next.js là web cloud/admin; Dart Frog giữ nghiệp vụ.
- Paper light/dark, Nunito, Home số dư/nhịp chi/túi/giao dịch gần đây, dock năm đích và camera.
- Tùy chỉnh tên/hình/màu túi lưu mã hóa theo owner trên thiết bị; chưa có đồng bộ cloud cho appearance túi.
- Guest tạo/sửa/xóa giao dịch, gallery system picker, OCR hóa đơn tổng hợp, lưu/mở lại ảnh và lịch hóa đơn đã được kiểm thử trên AVD mới.
- Học tài chính và dòng tiền có implementation preview cùng test local; không mặc nhiên là tính năng cloud đã phát hành.
- Quyết định chi phí: miễn phí ở giai đoạn hiện tại; AI miễn phí chỉ dùng tình huống tổng hợp. Câu trả lời cá nhân giữ local; cloud grading trả phí hoãn ngoài MVP hiện tại.

## Điều kiện chưa thể đóng bằng test source

| Hạng mục | Công việc/đầu vào còn cần |
| --- | --- |
| Android thật — chủ dự án tự nghiệm thu | Theo chỉ đạo 27/10, chủ dự án sẽ tự test camera/OCR thực, sinh trắc, độ mượt và cập nhật giữ dữ liệu sau. Không chặn việc tiếp tục các phần kỹ thuật khác; chưa đánh dấu PASS |
| Mobile cloud CRUD/offline/owner switch | **PASS trên Pixel 5/code 18** với hai fixture: tạo/sửa/xóa offline qua restart, A→B→A, server đúng một bản ghi và soft-delete; đã cleanup. Conflict editor và cloud receipt media không nằm trong lượt này |
| Billing | Bốn base plan ACTIVE tại VN. License testing đã lưu và tải lại xác nhận danh sách Picket Internal (3 tài khoản), RESPOND_NORMALLY. 21 mobile + 7 Dart tests, 22 assertions quyền gói cô lập và production negative checks đạt. Runtime mua mới=true đã postflight; RTDN topic persisted/Send Test HTTP 200. Còn delivery/lifecycle và S01–S14 bằng Play thật |
| Play Console | Browser MCP đã kết nối; license testers và RTDN topic/Send Test đã cấu hình. Còn Finance category, các khai báo/review hiện hành và delivery/lifecycle. API đã xác nhận 7 phoneScreenshots VI |
| Closed test — giữ draft theo chỉ đạo | Chủ dự án xác nhận chưa có nhóm/tester và yêu cầu giữ draft; không tự mở cohort hoặc chuyển alpha thành completed |
| Nội dung học | Đã hoàn thiện [giáo trình VI/EN bản biên tập 2](learning/README.md): 12 bài, 36 quiz, 12 bài tự kiểm tra và 60 phép tính. Đã soạn/rà nguồn; chưa gắn phê duyệt độc lập hoặc publish cloud |
| Dự báo | Dữ liệu lịch sử được phép dùng, đủ nhãn completeness và backtest 7/30 ngày; không dùng dữ liệu tổng hợp để tuyên bố độ chính xác thực |
| Pilot | Người dùng tự nguyện thực sự, thời gian sử dụng và phản hồi; không tạo bằng chứng giả |
| Khác | Các thay đổi local đã có trước lượt này cần review theo nhóm; tệp DOCX bị xóa chưa xác nhận chủ đích |

Các mục phụ thuộc thiết bị, người dùng, Google review hoặc thời gian thử nghiệm không được ghi PASS bằng suy luận. Danh sách này thay thế các danh sách pending lặp lại trong checkpoint cũ.

## Tài liệu liên quan

- [Báo cáo thực thi và kết quả mới](migration/PROJECT_COMPLETION_20261027.md)
- [Paper UI và native functional acceptance](migration/PAPER_UI_VERIFICATION_20261027.md)
- [OCR/code 17 và phát hành trước đó](migration/ANDROID_OCR_CODE17_PARTIAL_RECEIPTS_20261026.md)
- [Google Play readiness](google-play/RELEASE_READINESS_20261024.md)
- [Android thiết bị thật](ANDROID_REAL_DEVICE_CHECKLIST.md)
- [Billing sandbox](GOOGLE_PLAY_SANDBOX_TO_PRODUCTION.md)
- [Snapshot trạng thái cũ](migration/PROJECT_STATUS_20261025_SNAPSHOT.md)

## Kiểm tra toàn repository sau đồng bộ 27/10/2026

914 mobile, 54 web, 13 landing, 140 Dart tests và 13 bộ SQL PGlite đạt. Lint, typecheck, build web/landing và kiểm tra liên kết tài liệu đạt. Chi tiết cleanup, bản phát hành được giữ và quy trình Git tại [báo cáo đồng bộ](migration/REPOSITORY_SYNC_20261027.md). Các checkpoint cũ ở trên là bằng chứng lịch sử, không thay thế backlog hiện hành.
