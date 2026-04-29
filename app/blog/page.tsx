"use client";

import { useMemo, useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  category: "AI" | "Technology" | "Skills";
  excerpt: string;
};

const posts: BlogPost[] = [
  {
    id: "1",
    title: "Xu huong nghe nghiep AI 2026",
    category: "AI",
    excerpt: "Cac vai tro moi trong ky nguyen AI va ky nang can chuan bi.",
  },
  {
    id: "2",
    title: "Nganh cong nghe nao dang tang truong nhanh?",
    category: "Technology",
    excerpt: "Tong hop nhom nganh software, data, cloud va an ninh mang.",
  },
  {
    id: "3",
    title: "5 ky nang mem can co khi di lam",
    category: "Skills",
    excerpt: "Giao tiep, giai quyet van de, tu duy phan bien va tu hoc.",
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
          <h1 className="text-3xl font-bold">Blog xu huong nghe nghiep</h1>
          <p className="mt-2 text-slate-600">
            Chuc nang nang cao giup cap nhat thi truong lao dong va ky nang can thiet.
          </p>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-4 h-11 rounded-xl border border-slate-200 bg-white px-3"
          >
            <option value="all">Tat ca chu de</option>
            <option value="AI">AI</option>
            <option value="Technology">Technology</option>
            <option value="Skills">Skills</option>
          </select>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <p className="text-xs font-semibold text-blue-700">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-slate-700">{post.excerpt}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
