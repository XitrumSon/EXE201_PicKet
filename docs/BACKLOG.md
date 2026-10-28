# Công việc còn mở

Cập nhật 28/10/2026. [Hiện trạng](PROJECT_STATUS.md) · [Thiết kế duy nhất](../PICKET-DESIGN.md) · [Release 1.0.7/code 20](migration/ANDROID_RELEASE_1_0_7_20261027.md).

Đây là backlog hiện hành; không cộng lại mọi dòng “pending” trong checkpoint cũ. Phân biệt code đã có nhưng chưa nghiệm thu, tính năng chưa có và việc chủ động hoãn. Build, ảnh UI hoặc test source không thay thế nghiệm thu thiết bị/người dùng thật.

## Cần nghiệm thu trước khi mở rộng phát hành

| Việc | Trạng thái / bằng chứng còn cần | Phụ thuộc |
| --- | --- | --- |
| Điện thoại ARM64 | Camera/OCR hóa đơn thật, sinh trắc, thông báo, độ mượt và cập nhật giữ dữ liệu trên code 20 chưa có kết quả cuối | Chủ dự án đã nhận tự test; xem checklist thiết bị thật |
| Play Console | Finance/contacts/Advertising ID đã xác minh; 10 khai báo processed, không mục cần chú ý. App vẫn draft, gửi review đang khóa bởi bước thiết lập/closed test | Quyền Console; không suy từ API upload |
| RTDN từ Play | Đã quan sát RTDN purchase/renew/cancel/revoke và server cập nhật khi app đóng. Live duplicate/out-of-order replay bị approval chặn; offline handler test đạt | Thiết bị license tester |
| APKPure | Đã đăng nhập/readback 28/10: code 19 vẫn Publishing/Pending Approval, nút khóa. APK 1.0.10/code 23 và listing mới đã chuẩn bị, chờ nền tảng cho cập nhật | Review nền tảng/tài khoản chủ sở hữu |
| TalkBack | Có semantic/font/responsive kiểm từng phần; chưa có spoken audit toàn bộ luồng chính | Thiết bị hoặc môi trường assistive-tech phù hợp |

## Có implementation nhưng cần mở rộng kiểm chứng

- Backup/restore kèm ảnh: native round-trip, sai mật khẩu/file lỗi/giới hạn ảnh/lỗi giữa chừng. Codec tests không thay ca native.
- Hai thiết bị: media receipt/keepsake, cache và thay đổi đồng thời. CRUD offline/A→B→A và native conflict merge đã có bằng chứng, không coi toàn bộ sync chưa làm.
- Thông báo: ngưỡng ngân sách, đọc/ẩn, đổi lịch từ nơi khác, hoạt động nền trên thiết bị thật.
- Admin mới đã triển khai và kiểm thử theo [báo cáo 28/10](migration/ADMIN_PLATFORM_ACCEPTANCE_20261028.md). Còn nghiệm thu owner/MFA thật, luồng native staff online end-to-end và nguồn Play/vitals/sales khi nền tảng có quyền/báo cáo. Không bật bảo trì hoặc khóa user thật để thử.
- Ma trận dữ liệu: thống kê với income/refund/split/lịch sử lớn; bulk conflict/network/validation/tập lớn; UI từ chối thay đổi tháng đóng; điều kiện gói/ngày của partner notice.

## Chờ quyết định hoặc ngoài MVP hiện tại

| Việc | Quyết định hiện tại |
| --- | --- |
| Closed test | Giữ alpha draft theo chủ dự án. Khi mở cần nhóm/tester và cohort thật; không tự chuyển completed |
| Billing | Bốn SKU test verified/Publisher-acknowledged. Cancel/expiry/refund/decline/offline recovery/owner rejection/grace/hold/recovery và RTDN tương ứng đã kiểm chứng. Pending native không áp dụng cho auto-renew; còn live replay bị approval chặn; xem báo cáo 28/10 |
| Nội dung học cloud | VI/EN biên tập 2 đã có trong code 20; còn review độc lập/pilot và quyết định publish. Cloud hiện không có bài published |
| Cloud grading trả phí | Hoãn ngoài MVP. Không bật AI cá nhân hoặc truyền câu trả lời local lên cloud chỉ để đóng checklist |
| Diện mạo túi cloud | Tùy chỉnh đã lưu owner-local; chưa đồng bộ appearance qua cloud |
| Liên kết hóa đơn–món đồ | Hai mục riêng; hai hạn nhập thủ công. Liên kết/tự nhận diện hạn là mở rộng sản phẩm |
| Dự báo | Cần dữ liệu được phép dùng, completeness và backtest 7/30 ngày trước tuyên bố độ chính xác |
| Pilot thật | Cần người dùng tự nguyện, thời gian sử dụng và phản hồi; không tạo bằng chứng giả |
| Import Flutter thật | Đã loại khỏi MVP theo chủ dự án; chỉ mở lại khi có file lịch sử thật và nhu cầu cụ thể |
| CD tự động | Có script deploy landing; Git push chạy CI, chưa tự deploy VPS/Google Play |

## Không còn pending

- Landing đã lên APK 1.0.10/code 23 ARM64; Play Internal hiện 1.0.9/code 22 ARM64+x86_64. Alpha vẫn draft, beta/production chưa mở.
- Paper mobile, asset, sign-out/updater/guest splits; landing motion/footer/CTA và điều hướng sạch URL đã triển khai theo phản hồi.
- SMTP đã đổi sang Picket Production `<picketfinance@gmail.com>`, email recovery tới inbox thật đạt.
- Supabase đã đồng bộ 51 migration; không cần chạy lại migration chỉ để đồng bộ tài liệu.
- Dọn output build và hợp nhất design thuộc lượt repository sync hiện tại, theo [báo cáo](migration/REPOSITORY_SYNC_20261027.md).

Checkpoint Billing code 22 được bổ sung bởi [nghiệm thu ngày 28/10](migration/BILLING_RELEASE_ACCEPTANCE_20261028.md). Không còn gate Publisher ack/cancel/refund/grace/hold; pending native không áp dụng cho danh mục auto-renew; live replay còn bị approval chặn.

Ngày 28/10: [lifecycle và public release](migration/BILLING_RELEASE_ACCEPTANCE_20261028.md) thay checkpoint code 22 ở trên về các ca đã bổ sung. Publisher ack, cancel/expiry/refund, decline, offline recovery và owner rejection đã có bằng chứng mới. Không liệt kê lại các ca này là chưa chạy. Pending native không áp dụng cho auto-renew; grace/hold đã kiểm chứng; live replay còn bị approval chặn, xem báo cáo.
