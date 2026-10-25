import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createAppI18n } from "../../core/i18n/instance";
import { adminVi, adminEn } from "../../core/i18n/admin-resources";

test("admin action confirmation switches language while preserving the account ID and supplied content", async () => {
  const i18n = createAppI18n("vi"); const userId = "synthetic-user-id";
  assert.deepEqual(Object.keys(adminVi).sort(), Object.keys(adminEn).sort());
  for (const key of Object.keys(adminVi)) assert.ok(i18n.exists(key, { ns: "admin" }));
  assert.equal(i18n.t("confirmTitle", { ns: "admin" }), "Xác nhận quản trị");
  await i18n.changeLanguage("en");
  for (const key of Object.keys(adminEn)) assert.ok(i18n.exists(key, { ns: "admin" }));
  assert.equal(i18n.t("confirmTitle", { ns: "admin" }), "Confirm admin action");
  assert.equal(i18n.t("confirmAction", { ns: "admin", label: "Unlock", userId }), "Unlock for account synthetic-user-id? This action will be recorded in the audit log.");
  assert.equal(i18n.t("grantPlan", { ns: "admin", tier: "PLUS" }), "Grant PLUS for 30 days");
});

test("admin screen localizes controls and formatting while retaining server authorization and action tokens", () => {
  const source = readFileSync("src/app/admin.tsx", "utf8");
  assert.match(source, /useTranslation\("admin"\)/);
  assert.match(source, /label=\{t\(label\)\}/);
  assert.match(source, /\{t\(message\)\}/);
  assert.match(source, /isStaff\(\)/);
  for (const token of ["RESTORE", "SUSPEND", "RESET", "GRANT"]) assert.ok(source.includes(`confirmation:"${token}"`));
  assert.doesNotMatch(source, /"vi-VN"|t\((?:user\.email|item\.title|item\.body|notice|item\.target)\)/);
  assert.match(source, /\{item\.action\}/);
});
