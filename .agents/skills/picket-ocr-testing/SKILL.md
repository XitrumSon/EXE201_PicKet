---
name: picket-ocr-testing
description: "Ràng buộc nghiêm ngặt khi kiểm thử, đánh giá hình ảnh hóa đơn và sửa lỗi OCR trên Picket (Mobile ML Kit, Receipt Parser, Redmi 7 Corpus, và Server PaddleOCR). Kích hoạt khi người dùng gửi kèm hình hóa đơn, yêu cầu test OCR, chấm điểm corpus hoặc kiểm tra nhận diện hóa đơn."
---

# Picket OCR Testing & Evaluation Constraints

Khi kiểm thử một hình ảnh hóa đơn mới, chạy bộ test OCR, hoặc đánh giá kết quả trích xuất của Picket, Agent (**Luna**, **Gemini 3.8 Flash**, **Gemini 4 Argon**, **Sol**, **Astra**) **BẮT BUỘC** phải đối chiếu theo các ràng buộc nghiệp vụ dưới đây.

---

## 1. 7 Ràng Buộc Nghiệp Vụ Cốt Lõi (Chống "Làm giả PASS" / Overfitting)

1. **Cấm Hardcode theo ảnh mẫu:**
   - Tuyệt đối không viết regex hoặc điều kiện `if` bắt cứng tên cửa hàng, mã số, hoặc số tiền cụ thể của tấm ảnh người dùng vừa gửi. Mọi quy tắc parser phải tổng quát và không làm giảm điểm trên tập 54+ ảnh regression hiện có.
2. **Ranh giới Tổng phải trả (`Payable Total`):**
   - Phân biệt rõ **Tổng phải trả cuối cùng** với: Tổng tiền hàng (`Subtotal`), Thuế (`VAT/Tax`), Phí dịch vụ/vận chuyển (`Fee/Shipping`), Giảm giá (`Discount`), Tiền khách đưa (`Cash/Tendered`) và Tiền thừa (`Change`).
   - **Nếu không đọc được dòng Tổng cuối cùng:** Giữ `amount = null` (thiếu tổng). **CẤM** tự ý lấy tổng các dòng hàng cộng lại để gán làm Tổng phải trả khi chưa rõ thuế/phí/giảm giá.
   - Không ghép nhãn "Tổng" với một con số nằm xa ở cột/vùng khác chỉ vì ML Kit trả về kế tiếp nhau.
3. **Loại bỏ Metadata khỏi Danh sách Hàng hóa (`Line Items`) & `Merchant`:**
   - Số điện thoại, địa chỉ, mã chứng từ, tên thu ngân, khách hàng, số bàn, ngày giờ, dòng `SUBTTL`, `ITEMS 1.00`, phí giao hàng/vận chuyển **KHÔNG ĐƯỢC** nhận thành sản phẩm (`lineItems`).
   - `Merchant` (Tên cửa hàng) chỉ được lấy ở vùng đầu hóa đơn (trước danh sách sản phẩm). Nếu bị che/mờ hoặc chỉ có dòng món ăn kèm giá, phải để `merchant` trống (`null`) và bật cờ cần kiểm tra — **không** lấy tên món ăn hay chữ cuối bill làm tên cửa hàng.
   - Giữ nguyên tên thương hiệu có số hợp lệ (ví dụ: `PICKET MART QUAN 7`, `3 Miền`, `7UP`), không cắt nhầm số thương hiệu thành số lượng nếu không có dấu nhân (`x`).
4. **Ràng buộc Toán học & Độ tin cậy trên từng Dòng hàng:**
   - Kiểm tra quan hệ `quantity × unitPrice = lineTotal`. Nếu mâu thuẫn số học, không được tự ý sửa số cho khớp mà phải gắn cảnh báo để người dùng kiểm tra.
   - Nếu không có cột số lượng in rõ và phải suy ra `quantity = 1` / `unitPrice = lineTotal`, bắt buộc phải hạ `confidence` (đánh dấu là giá trị suy diễn cần review), không coi là dữ liệu đã quan sát thật.
   - Hỗ trợ tách số lượng đứng đầu có dấu nhân rõ (`2x Trà xanh`, `0,5 x Táo xanh`), nhưng không làm tròn phép chia lẻ không nguyên để tự tạo đơn giá.
   - Hàng tặng/khuyến mãi: Chỉ giữ khi có số lượng rõ và ô giá in số `0` rõ ràng; nếu ô giá bị trống hoặc mất chữ, không tự dựng số `0`.
5. **Xử lý Token Số bị hỏng & Ngoại tệ:**
   - Token số bị lẫn chữ do lỗi OCR (ví dụ: `12O000`, `12O900`, `TOTAL SAE3`, hoặc nhóm dấu chấm sai `1.23.456`) phải bị loại bỏ hoặc cảnh báo — **CẤM** cắt lấy phần đầu/đuôi (`12` hoặc `900`) làm giá tiền hợp lệ.
   - Tiền VND sử dụng số nguyên (chấp nhận hậu tố `.00` hoặc khoảng trắng cạnh dấu phân cách như `12. 000. 000`), nhưng không được cắt bỏ phần thập phân khác 0 (`12,50` không được biến thành `12`).
   - Khi phát hiện ký hiệu ngoại tệ rõ hoặc số thập phân lẻ, phải hiển thị cảnh báo ngoại tệ và chặn handoff lưu thẳng thành VND.
6. **Điều kiện Mở Màn Hình Review (Eligibility Gate):**
   - Cho phép vào màn hình Review khi:
     - Có đủ thông tin chuẩn, HOẶC
     - Hóa đơn bị che/thiếu `merchant` nhưng có ít nhất 2 dòng hàng dương và tổng các dòng hàng cộng/trừ các khoản thuế/phí/giảm giá **đọc được từ ảnh** khớp với Tổng phải trả, HOẶC
     - Có tiêu đề chứng từ, ngày hợp lệ và ít nhất 1 dòng hàng dương có phép tính quan sát được nhất quán.
   - Không dùng dữ liệu do người dùng gõ tay làm bằng chứng OCR để vượt cổng kiểm tra; không bao giờ tự động lưu giao dịch (`auto-save`) khi chưa qua bước người dùng xác nhận.
7. **Giới hạn Hiệu năng & Ngữ cảnh:**
   - Giữ ngân sách thời gian toàn phiên <= 20 giây, tái sử dụng cache đọc toàn ảnh trong cùng 1 session (`ReceiptReadCache`), hủy cache khi xoay ảnh hoặc đóng session.
   - Bỏ qua bước cắt ảnh chi tiết (`detail crop`) nếu bảng đã đọc đủ và khớp tổng.

---

## 2. Quy Trình Thực Thi Khi Kiểm Thử OCR (Theo Bước 3 của Workflow)

### Bước A: Khi người dùng gửi kèm 1–5 hình ảnh hóa đơn lẻ vào khung chat
1. Quan sát hình ảnh và lập **Nhãn Chuẩn Thực Tế (Ground Truth)** của riêng bức ảnh đó gồm:
   - `Merchant` thực tế trên giấy (hoặc `null` nếu bị cắt/che).
   - `Date` thực tế.
   - Danh sách từng dòng hàng: `Tên nguyên văn | SL | Đơn giá | Thành tiền`.
   - Các khoản điều chỉnh (`Subtotal`, `VAT/Tax`, `Fee`, `Discount`) và `Payable Total` cuối cùng.
   - Các dòng `Metadata bẫy` có trên ảnh (SĐT, địa chỉ, mã HĐ, tiền khách đưa) dễ bị nhận nhầm.
2. Chạy parser / kiểm thử trên ảnh đó và so sánh kết quả đầu ra với **Ground Truth** theo đúng 7 ràng buộc ở Mục 1.
3. Báo cáo rõ vào `REPORT.md`: Trường nào khớp (`EXACT`), trường nào thiếu (`MISSING`), trường nào sai (`WRONG`), và cờ cảnh báo (`needsReview`) có bật đúng chỗ không.

### Bước A2: Khi người dùng yêu cầu test cả thư mục `@Bill` (`d:\EXE201\Project\Bill` — 40+ ảnh)
- **QUY TẮC CHỐNG ĐỐT TOKEN VISION:** **TUYỆT ĐỐI CẤM** dùng công cụ đọc file ảnh (`read_file` / Vision) mở xem đồng loạt cả 40 tấm ảnh trong thư mục `Bill/` cùng một lúc (sẽ ngốn 40.000–60.000 tokens và làm tràn ngữ cảnh).
- **Quy trình chuẩn tiết kiệm 90% Token:**
  1. **Tận dụng Cache Native JSON trên PC trước:** Đối với 36 ảnh cũ trong `Bill/` đã có sẵn output ML Kit thật từ Redmi 7 (lưu trong `.artifacts/mobile-bugs-20261028/ocr-v3/`), chạy script Node/TS trên máy tính để chấm điểm qua `receipt-parser.ts` (tốn 0 token Vision, mất ~1 giây).
  2. **Chỉ chạy Redmi 7 (`ReceiptCorpusDeviceTest`) cho ảnh mới hoặc khi sửa code Java:**
     - Truyền `-PpicketReceiptCorpusDir=D:\EXE201\Project\Bill` (hoặc thư mục tạm chỉ chứa các ảnh mới thêm) để Redmi 7 chạy ML Kit phần cứng và xuất ra `receipt-corpus.json`.
  3. **Chỉ mở xem ảnh bằng AI Vision (tối đa 3–5 ảnh/lượt)** đối với:
     - Các ảnh mới vừa thêm vào `Bill/` chưa có nhãn chuẩn (`Ground Truth`).
     - Các ảnh bị `FAIL` (sai tổng, sai dòng hàng) cần nhìn mặt giấy để biết lỗi do ảnh mờ hay do parser.

### Bước B: Chạy bộ Unit Test OCR trên máy tính (Nhanh — Ưu tiên số 1)
Chạy lệnh kiểm tra tập trung riêng cho OCR (không chạy toàn bộ monorepo):
```powershell
cd apps/mobile
node --import tsx --test "src/core/ocr/*.test.ts"
```
Nếu cần đo coverage của riêng các module hóa đơn:
```powershell
cd apps/mobile
node --import tsx --test --experimental-test-coverage --test-coverage-include="src/core/ocr/receipt-*.ts" --test-coverage-exclude="**/*.test.ts" "src/core/ocr/*.test.ts"
```

### Bước C: Kiểm thử trên Điện thoại Android thật (VD: Xiaomi Redmi 7 `897bc71` hoặc máy cắm ADB)
*(Nếu môi trường không cắm điện thoại thật, chỉ thực hiện Bước B trên PC và ghi rõ vào `REPORT.md`, không tự ghi PASS cho phần cứng thật).*
Chỉ thực hiện khi bài test trên PC đã `PASS` hoặc khi sửa code Java trong `apps/mobile/modules/picket-receipt-ocr`:
1. **Kiểm tra Java Unit Test trước:**
   ```powershell
   cd apps/mobile/android
   ./gradlew :picket-receipt-ocr:testReleaseUnitTest
   ```
2. **Kiểm thử trên gói QA độc lập (`com.picket.mobile.bugqa`):**
   - Tuyệt đối không cài đè lên `com.picket.mobile`.
   - Mở ảnh hóa đơn trên thiết bị (mặc định `-s 897bc71` nếu là Redmi 7, hoặc kiểm tra qua `adb devices`), kiểm tra giao diện Review (không bấm nút Lưu giao dịch để giữ nguyên số dư QA `60.000`).
   - Thu thập bằng chứng gọn nhẹ:
     ```powershell
     adb -s 897bc71 logcat -d | Select-String "PICKET_OCR_PERF|PICKET_OCR_STATUS"
     adb -s 897bc71 shell dumpsys meminfo com.picket.mobile.bugqa | Select-String "TOTAL PSS"
     adb -s 897bc71 exec-out screencap -p > .artifacts/features/<feature-slug>/evidence/ocr-redmi7.png
     ```
3. **Dọn dẹp sau khi test:** Gỡ gói `.test` (nếu có chạy corpus instrumentation) và đảm bảo `REQUEST_INSTALL_PACKAGES: deny`.

