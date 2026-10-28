"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { createClient } from "@/core/supabase/client";
import { passwordValidationMessage } from "@/core/auth/password";
import { PasswordField } from "@/features/auth/components/password-field";

export function RegisterForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    const passwordIssue = passwordValidationMessage(password);
    if (passwordIssue) return setMessage(passwordIssue);
    if (password !== confirmation) return setMessage("Hai mật khẩu chưa khớp.");

    setBusy(true);
    setMessage(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setMessage(
          "Không thể tạo tài khoản. Email có thể đã được sử dụng hoặc bạn thao tác quá nhanh.",
        );
        setBusy(false);
        return;
      }
      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setMessage("Không thể kết nối. Kiểm tra mạng rồi thử lại.");
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Bắt đầu với Picket</h1>
      <p className="auth-copy">
        Tạo tài khoản để ghi chép và chăm chút kế hoạch của bạn.
      </p>
      <form
        className="auth-form"
        onSubmit={submit}
        aria-busy={busy}
        aria-describedby={message ? "register-message" : undefined}
      >
        <label>
          Email
          <input
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            name="email"
            required
            type="email"
          />
        </label>
        <PasswordField
          autoComplete="new-password"
          hint="Ít nhất 12 ký tự, gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt."
        />
        <PasswordField
          label="Nhập lại mật khẩu"
          name="confirmation"
          autoComplete="new-password"
        />
        {message && (
          <p className="form-message" id="register-message" role="alert">
            {message}
          </p>
        )}
        <button className="button primary" disabled={busy} type="submit">
          {busy ? "Đang tạo..." : "Đăng ký"}
        </button>
      </form>
      <p className="paper-auth-policy">
        Tìm hiểu cách Picket xử lý dữ liệu trong{" "}
        <a href="https://picketfinance.com/privacy.html">
          Chính sách quyền riêng tư
        </a>
        .
      </p>
      <Link className="back-link" href="/login">
        Đã có tài khoản? Đăng nhập
      </Link>
    </div>
  );
}
