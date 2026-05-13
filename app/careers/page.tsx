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
    name: "Kỹ sư cơ khí",
    riasec: "R",
    description: "Thiết kế, vận hành và bảo trì hệ thống máy móc công nghiệp.",
    salary: "15 - 30 triệu/tháng",
  },
  {
    id: "ky-thuat-vien-dien",
    name: "Kỹ thuật viên điện - điện tử",
    riasec: "R",
    description: "Lắp đặt, sửa chữa thiết bị điện và hệ thống điều khiển.",
    salary: "10 - 22 triệu/tháng",
  },
  {
    id: "quan-ly-thi-cong",
    name: "Quản lý thi công xây dựng",
    riasec: "R",
    description: "Giám sát công trình, điều phối nhân sự và tiến độ thi công.",
    salary: "14 - 28 triệu/tháng",
  },
  {
    id: "data-analyst",
    name: "Chuyên viên phân tích dữ liệu",
    riasec: "I",
    description: "Phân tích dữ liệu kinh doanh để hỗ trợ ra quyết định.",
    salary: "15 - 35 triệu/tháng",
  },
  {
    id: "lap-trinh-ai",
    name: "Kỹ sư AI",
    riasec: "I",
    description: "Xây dựng mô hình AI/ML cho bài toán doanh nghiệp.",
    salary: "20 - 50 triệu/tháng",
  },
  {
    id: "nghien-cuu-vien",
    name: "Nghiên cứu viên",
    riasec: "I",
    description: "Thực hiện đề tài nghiên cứu trong khoa học, xã hội hoặc y tế.",
    salary: "12 - 30 triệu/tháng",
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    riasec: "A",
    description: "Thiết kế ấn phẩm thương hiệu, truyền thông và digital.",
    salary: "10 - 25 triệu/tháng",
  },
  {
    id: "ux-ui",
    name: "UX/UI Designer",
    riasec: "A",
    description: "Thiết kế trải nghiệm và giao diện cho sản phẩm số.",
    salary: "14 - 35 triệu/tháng",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    riasec: "A",
    description: "Sản xuất nội dung sáng tạo trên nền tảng số.",
    salary: "8 - 30 triệu/tháng",
  },
  {
    id: "giao-vien",
    name: "Giáo viên",
    riasec: "S",
    description: "Giảng dạy và hướng dẫn học sinh phát triển kiến thức, kỹ năng.",
    salary: "8 - 20 triệu/tháng",
  },
  {
    id: "tu-van-tam-ly",
    name: "Chuyên viên tư vấn tâm lý",
    riasec: "S",
    description: "Hỗ trợ tâm lý, định hướng học tập và nghề nghiệp.",
    salary: "12 - 25 triệu/tháng",
  },
  {
    id: "nhan-su",
    name: "Chuyên viên nhân sự",
    riasec: "S",
    description: "Tuyển dụng, đào tạo và phát triển nguồn nhân lực doanh nghiệp.",
    salary: "12 - 30 triệu/tháng",
  },
  {
    id: "sales-manager",
    name: "Quản lý kinh doanh",
    riasec: "E",
    description: "Lập kế hoạch doanh số, lãnh đạo đội ngũ bán hàng.",
    salary: "18 - 45 triệu/tháng",
  },
  {
    id: "marketing-manager",
    name: "Quản lý marketing",
    riasec: "E",
    description: "Xây dựng chiến lược tiếp thị và phát triển thương hiệu.",
    salary: "18 - 50 triệu/tháng",
  },
  {
    id: "chuyen-vien-tu-van-tai-chinh",
    name: "Tư vấn tài chính",
    riasec: "E",
    description: "Tư vấn danh mục đầu tư và kế hoạch tài chính cá nhân.",
    salary: "15 - 40 triệu/tháng",
  },
  {
    id: "ke-toan",
    name: "Kế toán tổng hợp",
    riasec: "C",
    description: "Quản lý sổ sách, báo cáo tài chính và khai báo thuế.",
    salary: "10 - 25 triệu/tháng",
  },
  {
    id: "kiem-toan",
    name: "Kiểm toán viên",
    riasec: "C",
    description: "Kiểm tra tính minh bạch tài chính của doanh nghiệp.",
    salary: "14 - 35 triệu/tháng",
  },
  {
    id: "data-admin",
    name: "Chuyên viên quản trị dữ liệu",
    riasec: "C",
    description: "Quản lý, chuẩn hóa và bảo trì hệ thống dữ liệu doanh nghiệp.",
    salary: "12 - 28 triệu/tháng",
  },
  {
    id: "duoc-si",
    name: "Dược sĩ",
    riasec: "I",
    description: "Nghiên cứu, tư vấn và quản lý sử dụng thuốc an toàn.",
    salary: "10 - 25 triệu/tháng",
  },
  {
    id: "kien-truc-su",
    name: "Kiến trúc sư",
    riasec: "A",
    description: "Thiết kế công trình đảm bảo thẩm mỹ và công năng.",
    salary: "15 - 40 triệu/tháng",
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
          <h1 className="text-3xl font-bold text-[#0F2044]">20 ngành nghề phổ biến tại Việt Nam</h1>
          <p className="mt-2 text-slate-600">
            Tìm kiếm ngành nghề theo từ khóa và lọc theo nhóm tính cách RIASEC.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên ngành..."
              className="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-[#F5A623]/40 focus:ring"
            />
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value as "all" | RiasecGroup)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none ring-[#F5A623]/40 focus:ring"
            >
              <option value="all">Tất cả nhóm RIASEC</option>
              <option value="R">R - Realistic</option>
              <option value="I">I - Investigative</option>
              <option value="A">A - Artistic</option>
              <option value="S">S - Social</option>
              <option value="E">E - Enterprising</option>
              <option value="C">C - Conventional</option>
            </select>
            <div className="flex items-center text-sm text-slate-600">
              Tìm thấy{" "}
              <span className="mx-1 font-semibold text-[#0F2044]">{filtered.length}</span> ngành nghề
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <section className="rounded-2xl bg-white p-8 text-center shadow ring-1 ring-black/5">
            <p className="text-lg font-semibold text-[#0F2044]">Không tìm thấy ngành nghề phù hợp</p>
            <p className="mt-2 text-sm text-slate-600">Thử đổi từ khóa hoặc chọn lại nhóm RIASEC.</p>
          </section>
        ) : (
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
                  Mức lương trung bình: <span className="text-[#0F2044]">{career.salary}</span>
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
