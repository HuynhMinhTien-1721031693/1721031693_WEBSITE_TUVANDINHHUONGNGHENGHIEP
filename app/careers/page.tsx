"use client";

import { useMemo, useState } from "react";

type RiasecGroup = "R" | "I" | "A" | "S" | "E" | "C";

type CareerItem = {
  id: string;
  name: string;
  riasec: RiasecGroup;
  description: string;
  salary: string;
};

const careerData: CareerItem[] = [
  {
    id: "ky-su-co-khi",
    name: "Ky su co khi",
    riasec: "R",
    description: "Thiet ke, van hanh va bao tri he thong may moc cong nghiep.",
    salary: "15 - 30 trieu/thang",
  },
  {
    id: "ky-thuat-vien-dien",
    name: "Ky thuat vien dien - dien tu",
    riasec: "R",
    description: "Lap dat, sua chua thiet bi dien va he thong dieu khien.",
    salary: "10 - 22 trieu/thang",
  },
  {
    id: "quan-ly-thi-cong",
    name: "Quan ly thi cong xay dung",
    riasec: "R",
    description: "Giam sat cong trinh, dieu phoi nhan su va tien do thi cong.",
    salary: "14 - 28 trieu/thang",
  },
  {
    id: "data-analyst",
    name: "Chuyen vien phan tich du lieu",
    riasec: "I",
    description: "Phan tich du lieu kinh doanh de ho tro ra quyet dinh.",
    salary: "15 - 35 trieu/thang",
  },
  {
    id: "lap-trinh-ai",
    name: "Ky su AI",
    riasec: "I",
    description: "Xay dung mo hinh AI/ML cho bai toan doanh nghiep.",
    salary: "20 - 50 trieu/thang",
  },
  {
    id: "nghien-cuu-vien",
    name: "Nghien cuu vien",
    riasec: "I",
    description: "Thuc hien de tai nghien cuu trong khoa hoc, xa hoi hoac y te.",
    salary: "12 - 30 trieu/thang",
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    riasec: "A",
    description: "Thiet ke an pham thuong hieu, truyen thong va digital.",
    salary: "10 - 25 trieu/thang",
  },
  {
    id: "ux-ui",
    name: "UX/UI Designer",
    riasec: "A",
    description: "Thiet ke trai nghiem va giao dien cho san pham so.",
    salary: "14 - 35 trieu/thang",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    riasec: "A",
    description: "San xuat noi dung sang tao tren nen tang so.",
    salary: "8 - 30 trieu/thang",
  },
  {
    id: "giao-vien",
    name: "Giao vien",
    riasec: "S",
    description: "Giang day va huong dan hoc sinh phat trien kien thuc ky nang.",
    salary: "8 - 20 trieu/thang",
  },
  {
    id: "tu-van-tam-ly",
    name: "Chuyen vien tu van tam ly",
    riasec: "S",
    description: "Ho tro tam ly, dinh huong hoc tap va nghe nghiep.",
    salary: "12 - 25 trieu/thang",
  },
  {
    id: "nhan-su",
    name: "Chuyen vien nhan su",
    riasec: "S",
    description: "Tuyen dung, dao tao va phat trien nguon nhan luc doanh nghiep.",
    salary: "12 - 30 trieu/thang",
  },
  {
    id: "sales-manager",
    name: "Quan ly kinh doanh",
    riasec: "E",
    description: "Lap ke hoach doanh so, lanh dao doi ngu ban hang.",
    salary: "18 - 45 trieu/thang",
  },
  {
    id: "marketing-manager",
    name: "Quan ly marketing",
    riasec: "E",
    description: "Xay dung chien luoc tiep thi va phat trien thuong hieu.",
    salary: "18 - 50 trieu/thang",
  },
  {
    id: "chuyen-vien-tu-van-tai-chinh",
    name: "Tu van tai chinh",
    riasec: "E",
    description: "Tu van danh muc dau tu va ke hoach tai chinh ca nhan.",
    salary: "15 - 40 trieu/thang",
  },
  {
    id: "ke-toan",
    name: "Ke toan tong hop",
    riasec: "C",
    description: "Quan ly so sach, bao cao tai chinh va khai bao thue.",
    salary: "10 - 25 trieu/thang",
  },
  {
    id: "kiem-toan",
    name: "Kiem toan vien",
    riasec: "C",
    description: "Kiem tra tinh minh bach tai chinh cua doanh nghiep.",
    salary: "14 - 35 trieu/thang",
  },
  {
    id: "data-admin",
    name: "Chuyen vien quan tri du lieu",
    riasec: "C",
    description: "Quan ly, chuan hoa va bao tri he thong du lieu doanh nghiep.",
    salary: "12 - 28 trieu/thang",
  },
  {
    id: "duoc-si",
    name: "Duoc si",
    riasec: "I",
    description: "Nghien cuu, tu van va quan ly su dung thuoc an toan.",
    salary: "10 - 25 trieu/thang",
  },
  {
    id: "kien-truc-su",
    name: "Kien truc su",
    riasec: "A",
    description: "Thiet ke cong trinh dam bao tham my va cong nang.",
    salary: "15 - 40 trieu/thang",
  },
];

export default function CareersPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | RiasecGroup>("all");

  const filtered = useMemo(() => {
    return careerData.filter((item) => {
      const byGroup = group === "all" || item.riasec === group;
      const byQuery =
        !query.trim() ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return byGroup && byQuery;
    });
  }, [group, query]);

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
          <h1 className="text-3xl font-bold text-[#0F2044]">20 nganh nghe pho bien tai Viet Nam</h1>
          <p className="mt-2 text-slate-600">
            Tim kiem nganh nghe theo tu khoa va loc theo nhom tinh cach RIASEC.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tim theo ten nganh..."
              className="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-[#F5A623]/40 focus:ring"
            />
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value as "all" | RiasecGroup)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none ring-[#F5A623]/40 focus:ring"
            >
              <option value="all">Tat ca nhom RIASEC</option>
              <option value="R">R - Realistic</option>
              <option value="I">I - Investigative</option>
              <option value="A">A - Artistic</option>
              <option value="S">S - Social</option>
              <option value="E">E - Enterprising</option>
              <option value="C">C - Conventional</option>
            </select>
            <div className="flex items-center text-sm text-slate-600">
              Tim thay <span className="mx-1 font-semibold text-[#0F2044]">{filtered.length}</span> nganh nghe
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {filtered.map((career) => (
            <article key={career.id} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-[#0F2044]">{career.name}</h2>
                <span className="rounded-full bg-[#F5A623]/20 px-2.5 py-1 text-xs font-semibold text-[#0F2044]">
                  {career.riasec}
                </span>
              </div>
              <p className="mt-3 text-slate-700">{career.description}</p>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Muc luong trung binh: <span className="text-[#0F2044]">{career.salary}</span>
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
