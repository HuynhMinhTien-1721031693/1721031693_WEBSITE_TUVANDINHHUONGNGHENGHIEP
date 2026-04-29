"use client";

import { useMemo, useState } from "react";

type CareerItem = {
  id: string;
  name: string;
  field: "Technology" | "Business" | "Design" | "Education";
  demand: "Cao" | "Trung binh";
  description: string;
};

const careerData: CareerItem[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    field: "Technology",
    demand: "Cao",
    description: "Phat trien ung dung web/mobile va he thong backend.",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    field: "Technology",
    demand: "Cao",
    description: "Phan tich du lieu de ho tro quyet dinh kinh doanh.",
  },
  {
    id: "digital-marketer",
    name: "Digital Marketer",
    field: "Business",
    demand: "Cao",
    description: "Xay dung chien luoc marketing da kenh va do luong hieu qua.",
  },
  {
    id: "ux-ui-designer",
    name: "UX/UI Designer",
    field: "Design",
    demand: "Cao",
    description: "Thiet ke trai nghiem va giao dien san pham so.",
  },
  {
    id: "career-counselor",
    name: "Career Counselor",
    field: "Education",
    demand: "Trung binh",
    description: "Tu van dinh huong hoc tap va nghe nghiep ca nhan hoa.",
  },
];

export default function CareersPage() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<string>("all");

  const filtered = useMemo(() => {
    return careerData.filter((item) => {
      const byField = field === "all" || item.field === field;
      const byQuery =
        !query.trim() ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return byField && byQuery;
    });
  }, [field, query]);

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
          <h1 className="text-3xl font-bold">Trang gioi thieu nganh nghe</h1>
          <p className="mt-2 text-slate-600">
            Kham pha cac linh vuc pho bien va nhu cau thi truong de chon huong di phu hop.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tim theo ten nganh..."
              className="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-blue-200 focus:ring"
            />
            <select
              value={field}
              onChange={(event) => setField(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none ring-blue-200 focus:ring"
            >
              <option value="all">Tat ca linh vuc</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Education">Education</option>
            </select>
            <div className="flex items-center text-sm text-slate-600">
              Tim thay <span className="mx-1 font-semibold">{filtered.length}</span> nganh nghe
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {filtered.map((career) => (
            <article key={career.id} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <h2 className="text-xl font-semibold">{career.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {career.field} - Nhu cau: {career.demand}
              </p>
              <p className="mt-3 text-slate-700">{career.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
