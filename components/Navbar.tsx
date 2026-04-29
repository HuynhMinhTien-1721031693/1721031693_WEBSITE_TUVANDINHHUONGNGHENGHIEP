"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearAuth, getUser, isLoggedIn } from "@/lib/auth-client";

type NavUser = {
  name?: string;
  fullName?: string;
  email: string;
};

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/careers", label: "Ngành nghề" },
  { href: "/blog", label: "Blog" },
  { href: "/quiz", label: "Bài test" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, []);

  const displayName = user?.name || user?.fullName || "Người dùng";
  const avatar = displayName.charAt(0).toUpperCase() || "U";

  function handleLogout() {
    clearAuth();
    window.location.href = "/auth/login";
  }

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-xl font-bold text-[#0F2044]">
          CareerPath VN
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0F2044] md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
        </button>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[#0F2044]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!loggedIn ? (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-[#0F2044]/20 px-4 py-2 text-sm font-semibold text-[#0F2044] hover:bg-slate-50"
              >
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="btn-accent px-4 py-2 text-sm font-semibold">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2044] text-xs font-bold text-white">
                  {avatar}
                </span>
                <span className="max-w-[140px] truncate text-sm font-semibold text-[#0F2044]">
                  {displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[#0F2044]/20 px-4 py-2 text-sm font-semibold text-[#0F2044] hover:bg-slate-50"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 px-4 pb-4 md:hidden">
          <div className="mt-3 flex flex-col gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!loggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-lg border border-[#0F2044]/20 px-3 py-2 text-sm font-semibold text-[#0F2044]"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-accent px-3 py-2 text-center text-sm font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[#0F2044]/20 px-3 py-2 text-left text-sm font-semibold text-[#0F2044]"
              >
                Đăng xuất ({displayName})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
