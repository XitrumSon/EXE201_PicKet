---
name: picket-workflow-testing
description: "Quy trình chuẩn cho Bước 3 (TESTING) trong Picket Multi-Agent Workflow. Sử dụng khi Luna hoặc Agent kiểm thử cần chạy test theo phạm vi hẹp (Mobile, Web, Dart API, OCR Provider, Supabase DB), kiểm thử UI/Redmi 7 và ghi bằng chứng vào REPORT.md mà không sửa source code."
---

# Picket Workflow Testing Skill (Dành cho Bước 3 — TESTING)

Skill này hướng dẫn Agent kiểm thử (ưu tiên **Luna** ở mức Effort **`Light`/`Medium`**) thực hiện **Bước 3: TESTING** trong [`.agents/rules/workflow.md`](../../rules/workflow.md) với chi phí token thấp nhất và độ chính xác cao nhất.

---

## 1. 4 Nguyên Tắc Bất Di Bất Dịch Của Người Kiểm Thử (Tester)

1. **Cấm sửa code:** Tester **KHÔNG ĐƯỢC** sửa bất kỳ file source code hay file test nào. Nếu phát hiện lỗi, ghi nhận vào `REPORT.md` và trả về Bước 2 cho Developer (**Gemini 3.8 Flash** / **Gemini 4 Argon**).
2. **Đọc đúng phạm vi:** Chỉ đọc `.artifacts/features/<feature-slug>/PLAN.md`, Mục 1 của `REPORT.md` và `git diff -- <Allowed Files>`. Không quét toàn bộ repo.
3. **Chạy lệnh hẹp trước, lệnh rộng sau:** Chỉ chạy lệnh test của đúng file/phân hệ bị ảnh hưởng trong `PLAN.md`. Không tự ý chạy `npm test` tổng toàn monorepo nếu không phải bước chốt phát hành.
4. **Bằng chứng thực tế (Zero Hallucination):** Không bao giờ tự điền `PASS` bằng suy luận nếu chưa chạy lệnh hoặc khi môi trường thiếu thiết bị/quyền truy cập. Mọi kết quả `PASS/FAIL` phải gắn kèm tóm tắt kết quả chạy thực tế hoặc đường dẫn file trong `evidence/`.

---

## 2. Bảng Lệnh Kiểm Thử Phạm Vi Hẹp Theo Từng Phân Hệ

Chọn đúng lệnh tương ứng với phân hệ trong `PLAN.md`:

| Phân hệ | Lệnh chạy Unit / Integration Test hẹp | Lệnh kiểm tra tĩnh (Lint / Typecheck) |
| :--- | :--- | :--- |
| **Mobile (Chung)** | `cd apps/mobile && node --import tsx --test "<path/to/file.test.ts>"` | `npm run lint --prefix apps/mobile && npm run typecheck --prefix apps/mobile` |
| **Mobile (OCR)** | Đọc thêm [`.agents/skills/picket-ocr-testing/SKILL.md`](../picket-ocr-testing/SKILL.md) | Như Mobile (Chung) + `:picket-receipt-ocr:testReleaseUnitTest` |
| **Dart API** | `cd apps/api && dart test test/<file>_test.dart` | `cd apps/api && dart analyze` |
| **Web / Admin** | `node --test web/test/<file>.test.mjs` | `npm run lint --prefix web && npm run typecheck --prefix web` |
| **OCR Provider** | `cd services/ocr-provider && python -m unittest discover -s tests` | Kiểm tra cú pháp Python |
| **Supabase DB** | `npm run test:db` | Kiểm tra RLS & quyền `EXECUTE` trên hàm/trigger |
| **Landing** | `npm run test:landing` | Kiểm tra liên kết tải APK & SHA-256 |

---

## 3. Mẫu Ghi Kết Quả Vào `REPORT.md` (Tối đa 25 dòng — Tiết kiệm Token)

Sau khi chạy kiểm thử và lưu ảnh chụp/log vào `.artifacts/features/<feature-slug>/evidence/`, ghi nối tiếp vào **Mục 2** của `.artifacts/features/<feature-slug>/REPORT.md` theo đúng khung sau:

```markdown
## 2. Testing & Verification (by Luna)
- **Commands Executed:**
  - `<lệnh 1>` -> `PASS (X/X tests, Y ms)`
  - `<lệnh lint/typecheck>` -> `PASS (0 errors)`
- **Acceptance Criteria Status:**
  - `AC-1`: `PASS` — Evidence: `evidence/<file-1>`
  - `AC-2`: `PASS | FAIL` — Evidence: `evidence/<file-2>`
- **Real-Device / UI Check (nếu có):**
  - Thiết bị / Trình duyệt: `[Redmi 7 (com.picket.mobile.bugqa) | Playwright Chromium | N/A]`
  - Quan sát thực tế & Hiệu năng: `[VD: PICKET_OCR_PERF 580ms, PSS 185MB, số dư QA giữ nguyên 60.000]`
- **Failure Summary (Chỉ ghi khi có FAIL, <= 15 dòng):**
  - `[File:dòng] Mô tả ngắn gọn nguyên nhân lỗi để chuyển lại Bước 2.`
```

