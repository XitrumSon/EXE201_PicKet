import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import "../auth-paper.css";

const LANDING_URL = "https://picketfinance.com/";

const stories = {
  login: {
    title: "Tiền có chỗ.\nBạn có khoảng thở.",
    copy: "Ghi lại một khoản chi, giữ một hóa đơn, dành chỗ cho những dự định. Tiếp tục từ những điều nhỏ mỗi ngày.",
    image: "bloom",
    note: "Một chỗ cho những khoản nhỏ.",
  },
  register: {
    title: "Bắt đầu từ những\nkhoản nhỏ mỗi ngày.",
    copy: "Hiểu những gì đã chi, nhìn rõ điều muốn dành dụm. Cùng Picket chăm chút cho kế hoạch của riêng bạn.",
    image: "gift",
    note: "Dành chỗ cho điều sắp tới.",
  },
  recovery: {
    title: "Một chút trợ giúp.\nĐể bạn tiếp tục.",
    copy: "Quên mật khẩu cũng không sao. Nhận hướng dẫn qua email để trở lại với tài khoản Picket của bạn.",
    image: "receipt",
    note: "Quay lại với những điều đang chăm chút.",
  },
} as const;

export function AuthShell({
  variant,
  children,
}: {
  variant: keyof typeof stories;
  children: ReactNode;
}) {
  const story = stories[variant];
  return (
    <div className={`paper-auth paper-auth-${variant}`}>
      <a className="skip-link" href="#auth-content">
        Đến biểu mẫu
      </a>
      <header className="paper-auth-header">
        <a
          className="paper-auth-brand"
          href={LANDING_URL}
          aria-label="Picket, về trang chủ"
        >
          <Image
            src="/picket-logo.png"
            alt=""
            width={46}
            height={46}
            priority
          />
          <span>Picket</span>
        </a>
        <a className="paper-auth-home" href={LANDING_URL}>
          <span aria-hidden="true">←</span> Về trang chủ
        </a>
      </header>
      <main className="paper-auth-layout" id="auth-content">
        <section className="paper-auth-story" aria-label="Cùng Picket mỗi ngày">
          <h2>{story.title}</h2>
          <p>{story.copy}</p>
          <div className="paper-auth-art" aria-hidden="true">
            <div className="paper-auth-art-surface" />
            <Image
              src={`/auth-paper/paper-${story.image}.webp`}
              alt=""
              width={360}
              height={360}
              priority
            />
            <span className="paper-auth-art-note">{story.note}</span>
          </div>
          <div className="paper-auth-benefits" aria-label="Tính năng Picket">
            <span>Ghi thu chi</span>
            <span>Giữ hóa đơn</span>
            <span>Chăm dự định</span>
          </div>
        </section>
        <section
          className="paper-auth-panel"
          aria-label={
            variant === "recovery" ? "Khôi phục tài khoản" : "Tài khoản Picket"
          }
        >
          {variant !== "recovery" && (
            <nav className="paper-auth-switch" aria-label="Tài khoản">
              <Link
                href="/login"
                aria-current={variant === "login" ? "page" : undefined}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                aria-current={variant === "register" ? "page" : undefined}
              >
                Đăng ký
              </Link>
            </nav>
          )}
          {children}
        </section>
      </main>
      <footer className="paper-auth-footer">
        <p>© {new Date().getFullYear()} Picket. Chăm chút từng khoản nhỏ.</p>
        <nav aria-label="Thông tin và hỗ trợ">
          <a href={`${LANDING_URL}privacy.html`}>Quyền riêng tư</a>
          <a href="mailto:picketfinance@gmail.com">Liên hệ hỗ trợ</a>
        </nav>
      </footer>
    </div>
  );
}
