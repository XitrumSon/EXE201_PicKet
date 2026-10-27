# Giáo trình tài chính Picket — bản biên tập 2

Hoàn thiện nội dung ngày **27/10/2026**, dành cho người lớn từ 18 tuổi. Các bài dùng tình huống hư cấu tại Việt Nam, tiền VND và hoạt động có thể bỏ qua. [Trạng thái dự án](../PROJECT_STATUS.md).

## Đọc và sử dụng

- [Giáo trình đầy đủ tiếng Việt](PICKET_FINANCIAL_CURRICULUM_VI_V1.md)
- [Full English curriculum](PICKET_FINANCIAL_CURRICULUM_EN_V1.md)
- [Dữ liệu VI cho app](PICKET_FINANCIAL_CURRICULUM_VI_V1.json)
- [English app content](PICKET_FINANCIAL_CURRICULUM_EN_V1.json)
- [Hồ sơ biên tập, nguồn và kiểm tra](CONTENT_PACK_EDITORIAL_20261027.md)

Mỗi bài gồm mục tiêu, bài đọc, ví dụ, ba điểm ghi nhớ, một hiểu lầm thường gặp, một tình huống tự kiểm tra có lời giải từng bước, ba câu quiz có giải thích mọi lựa chọn, hành động tự chọn và nguồn tham khảo. Thân 12 bài VI có tổng 5.010 đơn vị cách trắng; phần tự kiểm tra và quiz nằm ngoài số đếm đó. Thời lượng học cần được đo với người học, không suy ra từ số từ.

## Lộ trình 6 chương / 12 bài

| Chương | Bài | Sau bài học, người học có thể |
| --- | --- | --- |
| 1. Ghi chép và phạm vi | 1. Chuyển ví không phải chi thêm | Tính đủ hai phía chuyển ví và tách phí |
| 1. Ghi chép và phạm vi | 2. Ghi đúng trước khi phân loại | Kiểm bản ghi trùng, ảnh hóa đơn và ngày thiếu dữ liệu |
| 2. Ưu tiên và thời điểm | 3. Nhu cầu và mong muốn cần bối cảnh | Giải thích lựa chọn bằng mục đích và khả năng thực tế |
| 2. Ưu tiên và thời điểm | 4. Lập kế hoạch theo ngày tiền về | Tìm thiếu hụt trước ngày có thu nhập |
| 3. Dự phòng và mục tiêu | 5. Quỹ dự phòng khác khoản đã biết trước | Tách khoản bất ngờ khỏi chi phí đã lên lịch |
| 3. Dự phòng và mục tiêu | 6. Chia mục tiêu thành bước có thể đổi | Tính lại mức góp hoặc thời hạn khi điều kiện thay đổi |
| 4. Số dư và kịch bản | 7. Số dư chưa phải tiền có thể dành ra | Tính phần chưa phân bổ theo cùng phạm vi ví |
| 4. Số dư và kịch bản | 8. Kịch bản giúp hỏi, không đoán chắc tương lai | Phân biệt dữ kiện, giả định và kết quả mô phỏng |
| 5. Hiểu khoản vay | 9. Nhìn tổng chi phí trước khoản trả nhỏ | So tổng phải trả, tiền thực nhận và phí đã biết |
| 5. Hiểu khoản vay | 10. Lịch trả quan trọng như tổng tiền | Tìm khoảng thiếu trước hạn và điều kiện cần xác minh |
| 6. Thanh toán và tiêu dùng | 11. Dừng một nhịp trước yêu cầu OTP | Nhận diện yêu cầu đáng ngờ và chọn kênh xác minh độc lập |
| 6. Thanh toán và tiêu dùng | 12. Dùng thử và khoảng chờ trước khi mua | Tính chi phí định kỳ và phân biệt nhắc việc với hủy dịch vụ |

## Cách học gợi ý

1. Đọc mục tiêu và bài đọc; giải lại ví dụ trước khi nhìn phép tính.
2. Dùng phần tự kiểm tra để tự nêu cách giải, rồi so với từng bước.
3. Làm ba câu quiz và đọc cả giải thích lựa chọn sai.
4. Có thể quay lại ôn tập hoặc bỏ qua hành động thực tế. Không cần mua hàng, đăng ký vay, chuyển tiền, cung cấp OTP hay gửi dữ liệu cho AI để hoàn thành.

Điểm quiz và XP chỉ ghi nhận hoạt động học. Chúng không đo mức giàu có, độ tín nhiệm hoặc sức khỏe tài chính của một cá nhân.

## Tái tạo và kiểm tra

Chạy từ root repository:

    python docs/learning/build_curriculum.py
    python docs/learning/build_curriculum_en.py
    npm run test:learning --prefix apps/mobile

Hai generator đồng bộ cả Markdown/JSON trong thư mục này và JSON tĩnh trong mobile. study_support.v1.json là nguồn cho phần ghi nhớ/tự kiểm tra song ngữ. Toàn repo có thể kiểm bằng npm test, đã bao gồm SQL regression.

ID bài, version quiz và 36 vị trí đáp án giữ nguyên để không làm mất tiến độ cũ. Bản bổ sung ghi editorialRevision=2; cả hai locale có cùng 60 phép kiểm số học. Không thay schema hoặc mở quyền chấm cloud.

Nội dung đã được tác giả đối chiếu nguồn/số học. Chưa có phê duyệt độc lập hoặc pilot người học; trạng thái công bố cloud vẫn là bản nháp. Nội dung biên tập 2 được đóng gói từ APK/AAB code 19 và tiếp tục có trong code 20; code 18 trước đó chưa có phần bổ sung.
