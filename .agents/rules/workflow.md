# PICKET MONOREPO — MULTI-AGENT COST & EFFORT WORKFLOW (DUAL-MODE)

Tài liệu này quy định quy trình phối hợp AI Agent cho dự án **Picket** ở giai đoạn hoàn thiện (Pre-release / Stabilization).
Quy trình hỗ trợ tự động **2 chế độ môi trường** để không gây xung đột giữa các thành viên trong nhóm:
- **Chế độ A — Hybrid (Codex + Antigravity):** Kết hợp Codex (`GPT-6.1 Terra`, `GPT-6.1 Sol`, `GPT-6 Sol`, `GPT-6 Astra`, `Luna`) để lập kế hoạch/kiểm thử/review và Antigravity (`Gemini 3.8 Flash`, `Gemini 4 Argon`) để viết code.
- **Chế độ B — Codex-Only (Chỉ dùng Codex):** Khi thành viên không sử dụng Antigravity, toàn bộ Bước 2 (Implementation) tự động chuyển sang các model của Codex theo bảng ánh xạ tương đương bên dưới.

Mọi AI Agent phải tuân thủ quy trình này cùng với [`.agents/rules/architecture.md`](architecture.md) và [`AGENTS.md`](../../AGENTS.md).

---

## 1. Cấu trúc Hồ sơ Tính năng / Bugfix (Giảm 40% Token lặp lại)

Mọi tài liệu làm việc phải đặt trong `.artifacts/features/<feature-slug>/` (đã được ignore trong `.gitignore`, không tạo thư mục ngoài gốc repository):

```text
.artifacts/features/<feature-slug>/
├── PLAN.md          # [Bước 1] Yêu cầu + Mã AC-1..N + Allowed Files + Scoped Commands
├── REPORT.md        # [Bước 2 & 3] Mục 1: Báo cáo Implementation | Mục 2: Báo cáo Testing & UI/Device
├── REVIEW.md        # [Bước 4] Đánh giá nghiệm thu độc lập (APPROVED / CHANGES_REQUESTED)
└── evidence/        # Ảnh chụp UI, screencap thiết bị Android, log lỗi rút gọn
```

---

## 2. Phân Luồng Tác Vụ (3-Lane Routing)

Trước khi bắt đầu, xác định quy mô công việc để chọn đúng luồng:

1. **LUỒNG S — Fast-Track (Sửa UI nhỏ, text, lint, format, hoặc 1 bug đơn lẻ trong 1–2 file):**
   - Bỏ qua việc tạo `PLAN.md` và `REVIEW.md`.
   - Giao thẳng **Gemini 3.8 Flash (`Low`)** *(hoặc **GPT-6 Sol / Luna (`Light`)** nếu chỉ dùng Codex)* sửa code và chạy unit test của file đó -> **Luna (`Light`)** kiểm chứng nhanh -> Handoff.
2. **LUỒNG M — Standard (Tính năng hoặc bug nằm gọn trong 1 phân hệ: `apps/mobile` HOẶC `web` HOẶC `apps/api`):**
   - Thực hiện đủ 5 bước với cấu hình Model & Effort mặc định.
3. **LUỒNG L — High-Risk / Cross-Boundary (Liên tầng, sửa `packages/` contracts, `supabase/migrations` & RLS, `services/ocr-provider`, hoặc `compose.production.yml`):**
   - Thực hiện đủ 5 bước, bắt buộc có **GPT-6 Astra** tham gia thẩm định ở Bước 1 và Bước 4.

---

## 3. Ràng Buộc Hệ Thống & Kỷ Luật Tiết Kiệm Token (BẮT BUỘC)

1. **Bảo toàn Kiến trúc & Working Tree hiện hành (`ADR-001` & `AGENTS.md`):**
   - Giữ nguyên hành vi ngoài phạm vi feature; ưu tiên tái sử dụng code trong `core` hoặc `packages/`.
   - Bảo toàn các thay đổi chưa commit ngoài phạm vi trong working tree. Luôn chạy `git diff -- <Allowed Files>` thay vì `git diff` toàn cục.
   - `apps/api` (Dart Frog) là backend nghiệp vụ duy nhất xử lý số tiền và quyền truy cập; `apps/mobile` và `web` chỉ dùng Supabase SDK cho phiên đăng nhập.
   - Không tự ý thêm dependency; không đưa secrets, signing keys, dữ liệu tài khoản thật hoặc APK/AAB vào source code hay Git; không sửa dữ liệu production.
2. **Kiểm soát Skill trong `~/.codex/skills` & `~/.gemini/skills` (Skill Gating):**
   - Quy trình này có quyền ưu tiên cao nhất, ghi đè mọi chỉ dẫn xung đột từ global skills.
   - **CHẶN kích hoạt tự động** `product-delivery` và `verification-loop` ở các bước trung gian (tránh chạy full build/test toàn monorepo gây lãng phí token).
   - Chỉ kích hoạt skill chuyên biệt khi đúng phân hệ:
     - **Chạy Bước 3 (TESTING):** Kích hoạt [`.agents/skills/picket-workflow-testing/SKILL.md`](../skills/picket-workflow-testing/SKILL.md).
     - **Kiểm thử / đánh giá ảnh hóa đơn OCR:** Kích hoạt [`.agents/skills/picket-ocr-testing/SKILL.md`](../skills/picket-ocr-testing/SKILL.md).
     - Viết test trước khi sửa code: `tdd-workflow` (`RED` -> `GREEN`).
     - Sửa `apps/api`: `dart-run-static-analysis`, `dart-add-unit-test`.
     - Sửa `supabase/`: `supabase-postgres-best-practices`.
     - Kiểm thử giao diện `web`: `playwright`.
3. **Khoanh vùng Đọc & Chống tràn ngữ cảnh (Context Pinning):**
   - **CẤM** chạy lệnh liệt kê hoặc tìm kiếm toàn cục (`grep`, `Get-ChildItem -Recurse`) trên `.artifacts/`, `node_modules/`, hoặc `.git/`.
   - Ở Bước 2, 3, 4: Chỉ đọc các file nằm trong danh sách `Allowed Files` của `PLAN.md`.
   - Tham chiếu tiêu chí bằng mã (`AC-1`, `AC-2`...), không chép lại đề bài giữa các file.
   - Không dán log dài quá 20 dòng vào `REPORT.md` hoặc `REVIEW.md` (lưu log chi tiết vào `evidence/`).
4. **Khóa trần Thanh trượt Effort:**
   - **Codex (`Light | Medium | High | Extra High | Ultra`):** Chỉ dùng `Light`, `Medium`, `High`. **CẤM dùng `Extra High` và `Ultra`** trừ khi có yêu cầu trực tiếp từ người dùng.
   - **Antigravity (`Low | Medium | High`):** Mặc định dùng `Gemini 3.8 Flash (Low/Medium)`. Chỉ nâng cấp lên `Gemini 4 Argon (Medium/High)` khi chạm cầu dao ngắt mạch ở Bước 2.

---

## 4. Ma Trận Phân Công Model & Mức Effort (Hỗ trợ cả Hybrid & Codex-Only)

| Bước / Nhiệm vụ | Chế độ A: Hybrid (Codex + Antigravity) | Chế độ B: Codex-Only (Chỉ dùng Codex) | Điều kiện nâng nấc / nâng model |
| :--- | :--- | :--- | :--- |
| **1. Lập kế hoạch thường** (Luồng M) | **GPT-6.1 Terra** (`Medium`) | **GPT-6.1 Terra** (`Medium`) | Lên **`High`** nếu tác động >= 4 file logic phức tạp. |
| **1b. Lập/duyệt kế hoạch kiến trúc** (Luồng L) | **GPT-6 Astra** (`Medium`) | **GPT-6 Astra** (`Medium`) | Lên **`High`** khi thiết kế luồng mới xuyên Mobile + API + DB. |
| **2. Viết code & tạo Unit Test** | **Gemini 3.8 Flash** (`Medium`) | **GPT-6.1 Sol** hoặc **GPT-6.1 Terra** (`Medium`) | Lên **`High`** nếu thuật toán/parser/state trong file phức tạp. |
| **2b. Sửa lỗi nhỏ, UI, format, lint, log** | **Gemini 3.8 Flash** (`Low`) / **Luna** (`Light`) | **GPT-6 Sol** hoặc **Luna** (`Light`) | Không tăng nấc cho tác vụ cơ học. |
| **2c. Xử lý lỗi khó / đa module (Sau 2 vòng lỗi)** | **Gemini 4 Argon** (`Medium` -> `High`) | **GPT-6 Astra** (`Medium` -> `High`) | Kích hoạt khi bước 2 thất bại sau 2 vòng sửa liên tiếp. |
| **3. Chạy Test, thao tác Browser / Android** | **Luna** *(hoặc **GPT-6 Sol**)* (`Light`) | **Luna** *(hoặc **GPT-6 Sol**)* (`Light`) | Lên **`Medium`** khi điều khiển UI nhiều bước trên Browser hoặc Android. |
| **4. Review độc lập** (Luồng M) | **GPT-6.1 Sol** / **GPT-6.1 Terra** (`Light`/`Medium`) | **GPT-6.1 Sol** / **GPT-6.1 Terra** (`Light`/`Medium`) | Lưu ý: Nếu Bước 2 dùng `Sol` thì Bước 4 dùng `Terra` (và ngược lại) để đảm bảo review độc lập. |
| **4b. Review rủi ro cao / Bất đồng kỹ thuật** | **GPT-6 Astra** (`Medium`) | **GPT-6 Astra** (`Medium`) | Lên **`High`** khi liên quan bảo mật, thanh toán, hoặc kiến trúc cốt lõi. |

---

## 5. Quy Trình 5 Bước Chi Tiết

### BƯỚC 1: PLANNING
- **Thực hiện:** **GPT-6.1 Terra (`Medium`)** phân tích yêu cầu và tạo `.artifacts/features/<feature-slug>/PLAN.md` (<= 60 dòng). Nếu yêu cầu phức tạp hoặc ảnh hưởng kiến trúc (`Luồng L`), chuyển **GPT-6 Astra (`Medium`/`High`)** review kế hoạch.
- **Nội dung bắt buộc trong `PLAN.md`:**
  1. `Acceptance Criteria`: Đánh mã `AC-1`, `AC-2`...
  2. `Allowed Files`: Danh sách đường dẫn file được phép đọc và sửa.
  3. `Implementation Steps`: Thứ tự viết test `RED` -> triển khai code `GREEN`.
  4. `Scoped Verification Commands`: Chọn đúng lệnh kiểm tra phạm vi hẹp nhất (không chạy `npm test` tổng ở bước lặp):
     - Mobile TS: `cd apps/mobile && node --import tsx --test "<path/to/file.test.ts>"`
     - Mobile Native Unit: `cd apps/mobile/android && ./gradlew :picket-receipt-ocr:testReleaseUnitTest`
     - Dart API: `cd apps/api && dart analyze && dart test test/<file>_test.dart`
     - Web: `node --test web/test/<file>.test.mjs`
     - OCR Provider: `cd services/ocr-provider && python -m unittest discover -s tests`
     - Database SQL: `npm run test:db`
  5. `Device / UI Gate`: Ghi rõ có cần chạy kiểm thử trên thiết bị Android thật / Emulator hoặc trình duyệt ở Bước 3 hay không.
- **Cổng dừng:** **Dừng để người dùng phê duyệt trước khi sang Bước 2.**

### BƯỚC 2: IMPLEMENTATION
- **Thực hiện:**
  - **Nếu dùng Antigravity (Chế độ A):** Dùng **Gemini 3.8 Flash (`Low` / `Medium`)** để triển khai. Nếu gặp lỗi phức tạp, nhiều module hoặc thất bại sau 2 vòng sửa, dừng và chuyển cho **Gemini 4 Argon (`Medium` -> `High`)** xử lý.
  - **Nếu chỉ dùng Codex (Chế độ B):** Dùng **GPT-6.1 Sol (`Medium`)** hoặc **GPT-6.1 Terra (`Medium`)** (sửa nhỏ dùng **GPT-6 Sol (`Light`)**). Nếu gặp lỗi phức tạp hoặc thất bại sau 2 vòng sửa, dừng và chuyển cho **GPT-6 Astra (`Medium` -> `High`)** xử lý.
- **Đầu ra:**
  - Kiểm tra `git diff -- <Allowed Files>` và chạy `Scoped Verification Commands`.
  - Ghi vào **Mục 1 (`## 1. Implementation`)** của `REPORT.md` (<= 25 dòng): Danh sách file đã sửa, bằng chứng `RED` -> `GREEN`, và các điểm khác biệt so với `PLAN.md` (nếu có).

### BƯỚC 3: TESTING & REAL-DEVICE VERIFICATION
- **Thực hiện:** **Luna (`Light` / `Medium`)** đọc `PLAN.md`, Mục 1 của `REPORT.md` và kích hoạt skill [`.agents/skills/picket-workflow-testing/SKILL.md`](../skills/picket-workflow-testing/SKILL.md) (nếu liên quan đến OCR hoặc người dùng gửi kèm ảnh hóa đơn, bắt buộc đọc thêm [`.agents/skills/picket-ocr-testing/SKILL.md`](../skills/picket-ocr-testing/SKILL.md)).
- **Quy tắc cứng:** **Luna KHÔNG sửa source code và KHÔNG sửa file test.**
- **Nhiệm vụ:**
  - Chạy lệnh test được phê duyệt + kiểm tra `lint`/`typecheck` của phân hệ đó (`npm run lint --prefix <app>`, `npm run typecheck --prefix <app>`).
  - Mở ứng dụng và thực hiện kiểm thử giao diện (Browser hoặc thiết bị Android) nếu môi trường hỗ trợ và được yêu cầu trong `PLAN.md`.
  - Ghi bằng chứng thực tế vào **Mục 2 (`## 2. Testing`)** của `REPORT.md` (<= 25 dòng) và lưu ảnh/log vào `evidence/`.

#### Quy tắc bắt buộc khi kiểm thử trên Thiết bị Android thật (VD: Xiaomi Redmi 7 `897bc71` hoặc máy cắm ADB)
*(Nếu máy đồng nghiệp không cắm thiết bị thật, chỉ chạy Unit Test trên PC hoặc Android Emulator và ghi rõ môi trường vào `REPORT.md`, không tự suy diễn PASS cho phần cứng thật).*
1. **Tiết kiệm vòng lặp Build:**
   - Khi đang sửa logic TypeScript (`apps/mobile/src/core/ocr/*.ts`), ưu tiên chạy unit test trên PC với dữ liệu output native đã lưu sẵn. Chỉ build/chạy trên thiết bị Android khi unit test trên PC đã PASS hết hoặc khi có sửa code Java (`picket-receipt-ocr`).
2. **Cô lập Package An toàn:**
   - Chỉ cài và kiểm thử trên gói QA **`com.picket.mobile.bugqa`**.
   - **TUYỆT ĐỐI CẤM** gỡ, xóa dữ liệu (`pm clear`), hoặc cài đè lên gói chính thức **`com.picket.mobile`** đang cài trên máy.
3. **Bảo toàn Dữ liệu Đối chứng:**
   - Khi kiểm thử luồng Quét hóa đơn (OCR) -> Form giao dịch trên `com.picket.mobile.bugqa`, chỉ kiểm tra các trường hiển thị (Merchant, Items, Total, Cảnh báo), **KHÔNG bấm "Lưu giao dịch"** để giữ nguyên số dư đối chứng (`60.000` trên Dashboard), trừ khi kịch bản yêu cầu tạo và xóa fixture ngay lập tức.
4. **Lệnh thu thập bằng chứng tự động qua ADB (Gọn nhẹ, không tràn log):**
   - Kiểm tra thiết bị đang cắm: `adb devices -l` (dùng `-s <device_id>`, ví dụ `-s 897bc71` cho Redmi 7).
   - Trích xuất log hiệu năng & trạng thái OCR:
     `adb -s <device_id> logcat -d | Select-String "PICKET_OCR_PERF|PICKET_OCR_STATUS"`
   - Đo bộ nhớ RAM (PSS) sau lượt chạy UI:
     `adb -s <device_id> shell dumpsys meminfo com.picket.mobile.bugqa | Select-String "TOTAL PSS"`
   - Chụp ảnh màn hình thực tế lưu vào `evidence/`:
     `adb -s <device_id> exec-out screencap -p > .artifacts/features/<feature-slug>/evidence/<step>.png`
5. **Dọn dẹp thiết bị sau khi test (Post-Test Cleanup):**
   - Gỡ ngay gói instrumentation test (nếu có cài) sau khi kéo kết quả về PC.
   - Xóa các file APK tạm trong thư mục Downloads trên điện thoại và đảm bảo quyền cài đặt của File Manager trở về `REQUEST_INSTALL_PACKAGES: deny`.

### BƯỚC 4: REVIEW
- **Thực hiện:** **GPT-6.1 Sol** hoặc **GPT-6.1 Terra** (**`Light` / `Medium`**) đọc `PLAN.md`, `REPORT.md` và `git diff -- <Allowed Files>`. *(Nếu ở Chế độ B đã dùng `Sol` để viết code ở Bước 2, bắt buộc dùng `Terra` hoặc `Astra` để review ở Bước 4 nhằm đảm bảo tính độc lập).* Dùng **GPT-6 Astra (`Medium` / `High`)** khi cần phân tích sâu (`Luồng L`) hoặc xử lý bất đồng kỹ thuật.
- **Đầu ra:** Ghi vào `REVIEW.md` (<= 25 dòng):
  - Phán quyết: `APPROVED` hoặc `CHANGES_REQUESTED`.
  - Không chấp nhận nếu còn lỗi nghiêm trọng, vi phạm ranh giới kiến trúc, hoặc thiếu bằng chứng trong `evidence/` cho các tiêu chí `AC` bắt buộc.

### BƯỚC 5: HANDOFF
Chỉ bàn giao khi đạt đủ 5 điều kiện:
- [ ] Tất cả tiêu chí nghiệm thu bắt buộc (`AC-1..N`) đã đạt `PASS`.
- [ ] `REPORT.md` (Implementation + Testing) và `REVIEW.md` (`APPROVED`) đầy đủ, kèm bằng chứng trong `evidence/`.
- [ ] Diff của các file trong phạm vi đã được kiểm tra sạch sẽ, không làm ảnh hưởng các file ngoài phạm vi.
- [ ] Tài liệu liên quan (`docs/PROJECT_STATUS.md`, `docs/BACKLOG.md`, `docs/migration/`) đã cập nhật nếu có yêu cầu.
- [ ] Có commit theo chuẩn Conventional Commits (`feat(<scope>): ...`, `fix(<scope>): ...`) hoặc Pull Request để truy vết thay đổi.

*(Nếu không đạt, ghi rõ nhiệm vụ sửa lỗi mới vào cuối `REVIEW.md` và quay lại Bước 2).*
