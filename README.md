# Picket

Trạng thái chung: [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md); [mục lục tài liệu](docs/README.md). Landing phục vụ APK **1.0.11/code 24**; Play Internal đã cập nhật **1.0.11/code 24**. Supabase đã đồng bộ **51 migration**. Admin platform và ba trang xác thực Paper đã triển khai production ngày 28/10; [báo cáo nghiệm thu](docs/migration/ADMIN_PLATFORM_ACCEPTANCE_20261028.md) ghi bằng chứng và các giới hạn còn phụ thuộc nền tảng. Closed test giữ draft.

Picket dùng một kiến trúc thống nhất: Next.js cho web, Expo/React Native cho
Android và Dart Frog cho toàn bộ backend nghiệp vụ.

```text
Next.js web ────┐
                ├── REST / OpenAPI ── Dart Frog ── Supabase / Postgres
Expo Android ───┘
```

Thiết kế chuẩn duy nhất: [PICKET-DESIGN.md](PICKET-DESIGN.md). Việc còn mở: [BACKLOG](docs/BACKLOG.md).

## Cấu trúc chính

- `apps/api`: API Dart Frog; xác thực Supabase JWT, giữ nguyên RLS và cung cấp profile/onboarding/preferences cùng finance contract trên các bảng chuẩn hóa.
- `apps/mobile`: Expo SDK 57 / React Native; ứng dụng Android chính thức.
- `apps/landing`: landing static tải APK, dùng chung manifest phiên bản với chức năng cập nhật trong app.
- `web`: Next.js 16; web client và admin portal.
- `packages/api-client`: REST client dùng chung cho Next.js và Expo.
- `packages/domain-ts`: hợp đồng dữ liệu tài chính TypeScript.
- `packages/design-tokens`: màu sắc và kích thước dùng chung.
- `supabase`: schema, RLS, RPC và Edge Functions hiện tại.

Chi tiết quyết định kiến trúc và lộ trình nằm trong
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md),
[ADR-001](docs/architecture/ADR-001-next-expo-dart.md) và
[feature parity matrix](docs/migration/FEATURE_PARITY.md).

## Chạy local

Tạo file `.env` từ `.env.example` trong từng ứng dụng cần chạy, sau đó:

```powershell
cd apps/api
dart_frog dev

cd web
npm install
npm run dev

cd apps/mobile
npm install
npm run start
```

Android Emulator truy cập máy host qua `http://10.0.2.2:8080`. Điện thoại thật cần đặt `EXPO_PUBLIC_API_URL` thành IP LAN của máy chạy API.

## Triển khai production một VPS

Stack Caddy + Next.js + Dart Frog + OCR worker + PP-OCR CPU nằm trong
`compose.production.yml`. Hướng dẫn DNS, secret, build, smoke test và rollback:
[deploy/VPS_DEPLOYMENT.md](deploy/VPS_DEPLOYMENT.md).

Kiểm tra SQL/migration local: `npm ci --prefix supabase/tests` rồi `npm run test:db`. Lệnh `npm test` đã bao gồm kiểm tra này cùng landing/mobile/web/API; backend CI cũng thực thi nó. Chi tiết: [Supabase](supabase/README.md).

## Kiểm tra và dọn output

Chạy `npm test`, `npm run lint`, `npm run typecheck` trước bàn giao. Xem `npm run cleanup:generated` trước khi xóa; sao lưu mọi APK/AAB khác nhau vào `.artifacts/releases/`, rồi chạy `npm run cleanup:generated:apply`. Không commit `.env`, keystore, APK/AAB hoặc cache. Artifact phát hành giữ local, không nằm trong Git.

Landing: [build/deploy/rollback](apps/landing/README.md). Git push chạy CI, chưa tự deploy VPS hoặc Google Play.
