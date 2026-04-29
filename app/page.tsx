"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/careers", label: "Ngành nghề" },
  { href: "/quiz", label: "Quiz" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/booking", label: "Tư vấn 1-1" },
  { href: "/auth", label: "Đăng nhập" },
];

const stats = [
  { value: "25,000+", label: "Học sinh đã tư vấn" },
  { value: "180+", label: "Ngành nghề cập nhật" },
  { value: "96%", label: "Mức độ hài lòng" },
];

const features = [
  {
    icon: "🧠",
    title: "Đánh giá tính cách",
    description: "Bộ câu hỏi ngắn gọn giúp nhận diện nhóm năng lực nổi trội của bạn.",
  },
  {
    icon: "🎯",
    title: "Gợi ý nghề phù hợp",
    description: "AI đề xuất nghề nghiệp theo điểm mạnh, sở thích và mục tiêu học tập.",
  },
  {
    icon: "🗺️",
    title: "Lộ trình phát triển",
    description: "Nhận roadmap rõ ràng theo từng giai đoạn học tập và kỹ năng cần có.",
  },
  {
    icon: "📈",
    title: "Theo dõi tiến độ",
    description: "Lưu kết quả và theo dõi quá trình định hướng nghề nghiệp qua dashboard.",
  },
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-lg font-bold text-[#0F2044]">
            Career Guidance
          </Link>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-[#0F2044] md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
          </button>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 transition hover:text-[#0F2044]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-gray-200 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="bg-[#0F2044]">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-24">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white">
              Nền tảng tư vấn hướng nghiệp
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Khám phá nghề nghiệp phù hợp với{" "}
              <span className="text-[#F5A623]">năng lực và đam mê</span> của bạn
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
              Kết hợp bài test khoa học và gợi ý AI để giúp học sinh, sinh viên chọn đúng
              ngành, đúng lộ trình và tự tin hơn với quyết định tương lai.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="btn-accent px-6 py-3 text-sm font-semibold"
              >
                Bắt đầu làm bài test
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Xem dashboard mẫu
              </Link>
            </div>
          </div>
        </section>

        <section className="-mt-8 px-4 md:px-6">
          <div className="mx-auto grid w-full max-w-6xl gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:grid-cols-3">
            {stats.map((item) => (
              <article key={item.label} className="text-center">
                <p className="text-3xl font-bold text-[#0F2044] md:text-4xl">{item.value}</p>
                <p className="mt-1 text-sm text-slate-600">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F2044] md:text-3xl">Tính năng nổi bật</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Một hành trình định hướng nghề nghiệp trực quan, cá nhân hóa và dễ theo dõi.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="app-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#1D9E75]/10 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0F2044]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#0F2044] px-4 py-16 md:px-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Sẵn sàng khám phá con đường phù hợp?</h2>
              <p className="mt-2 text-slate-200">
                Bắt đầu bài test ngay hôm nay để nhận tư vấn nghề nghiệp cá nhân hóa.
              </p>
            </div>
            <Link href="/quiz" className="btn-accent px-6 py-3 text-sm font-semibold">
              Bắt đầu làm bài test
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
