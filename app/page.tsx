import Link from "next/link";

const features = [
  {
    title: "Bài kiểm tra tính cách",
    description: "10 câu hỏi chấm điểm để xác định nhóm nghề phù hợp.",
    href: "/quiz",
    cta: "Làm bài test",
  },
  {
    title: "Chat AI hướng nghiệp",
    description:
      "Nhận tư vấn nghề, lộ trình học và mức lương tham khảo theo bối cảnh cá nhân.",
    href: "/quiz",
    cta: "Trải nghiệm AI",
  },
  {
    title: "Dashboard kết quả",
    description:
      "Theo dõi điểm mạnh, nghề đề xuất và các bước hành động tiếp theo.",
    href: "/dashboard",
    cta: "Xem dashboard",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 px-4 py-8 text-slate-900 md:px-8">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5 md:p-12">
          <p className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Career Guidance Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Website hướng nghiệp hiện đại cho học sinh và sinh viên
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600 md:text-lg">
            Bắt đầu từ bài test tính cách, nhận tư vấn AI theo điểm mạnh và theo
            dõi tiến trình trên dashboard cá nhân.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Xem dashboard mẫu
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              <Link
                href={feature.href}
                className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:underline"
              >
                {feature.cta}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
