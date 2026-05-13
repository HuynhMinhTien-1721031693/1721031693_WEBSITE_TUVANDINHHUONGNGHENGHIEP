"use client";

import { useMemo, useState } from "react";

type BlogCategory = "AI" | "Technology" | "Skills" | "Career" | "Study";

type BlogPost = {
  id: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
};

const CATEGORY_LABEL: Record<BlogCategory, string> = {
  AI: "AI & tự động hóa",
  Technology: "Công nghệ",
  Skills: "Kỹ năng",
  Career: "Hướng nghiệp",
  Study: "Học đường",
};

const posts: BlogPost[] = [
  {
    id: "1",
    title: "Xu hướng nghề nghiệp AI năm 2026",
    category: "AI",
    excerpt: "Các vai trò mới trong kỷ nguyên AI và kỹ năng cần chuẩn bị từ sớm.",
  },
  {
    id: "2",
    title: "Ngành công nghệ nào đang tăng trưởng nhanh?",
    category: "Technology",
    excerpt: "Tổng hợp nhóm ngành phần mềm, dữ liệu, đám mây và an ninh mạng.",
  },
  {
    id: "3",
    title: "5 kỹ năng mềm cần có khi đi làm",
    category: "Skills",
    excerpt: "Giao tiếp, giải quyết vấn đề, tư duy phản biện và tự học liên tục.",
  },
  {
    id: "4",
    title: "Mô hình Holland (RIASEC) áp dụng thế nào khi chọn nghề?",
    category: "Career",
    excerpt: "Hiểu 6 nhóm tính cách để gợi ý ngành học và môi trường làm việc phù hợp.",
  },
  {
    id: "5",
    title: "Chọn ngành theo đam mê hay theo thị trường?",
    category: "Career",
    excerpt: "Cách cân bằng giữa sở thích cá nhân và nhu cầu tuyển dụng thực tế.",
  },
  {
    id: "6",
    title: "Lộ trình học lập trình sau THPT cho người mới",
    category: "Technology",
    excerpt: "Từ nền tảng, dự án nhỏ đến thực tập — thứ tự học giúp tiến bộ bền vững.",
  },
  {
    id: "7",
    title: "Viết CV và thư xin việc gây ấn tượng với nhà tuyển dụng",
    category: "Skills",
    excerpt: "Cấu trúc rõ ràng, số liệu minh họa và cách tùy chỉnh theo từng vị trí.",
  },
  {
    id: "8",
    title: "Học song song nhiều kỹ năng: nên hay không?",
    category: "Study",
    excerpt: "Chiến lược ưu tiên, tránh quá tải và giữ động lực học dài hạn.",
  },
  {
    id: "9",
    title: "Thực tập: bắt đầu từ đâu khi chưa có kinh nghiệm?",
    category: "Career",
    excerpt: "Dự án cá nhân, câu lạc bộ, hackathon và cách chủ động xin mentor.",
  },
  {
    id: "10",
    title: "An toàn khi dùng AI trong học tập và viết luận",
    category: "AI",
    excerpt: "Phân biệt hỗ trợ và sao chép, trách nhiệm học thuật và bảo vệ dữ liệu cá nhân.",
  },
  {
    id: "11",
    title: "Chuẩn bị tâm lý trước kỳ thi tốt nghiệp và tuyển sinh",
    category: "Study",
    excerpt: "Quản lý thời gian, giấc ngủ và kỹ thuật ôn tập ngắn — nhắc lại — kiểm tra.",
  },
  {
    id: "12",
    title: "Làm việc nhóm hiệu quả trong môi trường học tập hybrid",
    category: "Skills",
    excerpt: "Phân vai, họp ngắn gọn và công cụ phối hợp trực tuyến phổ biến.",
  },
];

export default function BlogPage() {
  const [category, setCategory] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    return posts.filter((item) => category === "all" || item.category === category);
  }, [category]);

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
          <h1 className="text-3xl font-bold text-[#0F2044]">Blog xu hướng nghề nghiệp</h1>
          <p className="mt-2 text-slate-600">
            Cập nhật thị trường lao động, định hướng nghề nghiệp và kỹ năng cần thiết cho học sinh,
            sinh viên.
          </p>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-4 h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none ring-[#F5A623]/40 focus:ring"
          >
            <option value="all">Tất cả chủ đề</option>
            {(Object.keys(CATEGORY_LABEL) as BlogCategory[]).map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABEL[key]}
              </option>
            ))}
          </select>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <p className="text-xs font-semibold text-[#0F2044]">{CATEGORY_LABEL[post.category]}</p>
              <h2 className="mt-2 text-xl font-semibold text-[#0F2044]">{post.title}</h2>
              <p className="mt-2 text-slate-700">{post.excerpt}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
