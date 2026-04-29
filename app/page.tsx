import Link from "next/link";

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
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <main>
        <section className="bg-[#0F2044]">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-24">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white">
              Nền tảng định hướng nghề nghiệp cho học sinh Việt Nam
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Chọn nghề đúng từ sớm,{" "}
              <span className="text-[#F5A623]">đi xa hơn trong tương lai</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
              CareerPath VN kết hợp bài test RIASEC, dữ liệu thị trường lao động và AI tư vấn để
              giúp bạn xác định ngành học phù hợp nhất.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quiz" className="btn-accent px-6 py-3 text-sm font-semibold">
                Bắt đầu làm bài test
              </Link>
              <Link
                href="/careers"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Khám phá ngành nghề
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
            <h2 className="text-2xl font-bold text-[#0F2044] md:text-3xl">Tại sao chọn CareerPath VN?</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Lộ trình rõ ràng từ hiểu bản thân đến chọn ngành, chọn nghề và kế hoạch phát triển.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="app-card p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5A623]/15 text-2xl">
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
                Làm bài test ngay để nhận gợi ý nghề nghiệp cá nhân hóa trong vài phút.
              </p>
            </div>
            <Link href="/quiz" className="btn-accent px-6 py-3 text-sm font-semibold">
              Bắt đầu làm bài test ngay
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
          <div>
            <p className="text-lg font-bold text-[#0F2044]">CareerPath VN</p>
            <p className="mt-2 text-sm text-slate-600">
              Đồng hành cùng học sinh Việt Nam trên hành trình chọn đúng ngành, đúng nghề.
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#0F2044]">Liên kết nhanh</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/">Trang chủ</Link>
              <Link href="/careers">Ngành nghề</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/quiz">Bài test</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[#0F2044]">Hỗ trợ</p>
            <p className="mt-3 text-sm text-slate-600">Email: support@careerpath.vn</p>
            <p className="text-sm text-slate-600">Hotline: 1900 1234</p>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          Copyright © {new Date().getFullYear()} CareerPath VN. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
