"use client";

import { FormEvent, useState } from "react";

function BookingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName || !email || !date || !topic) {
      setNotice("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setNotice("Đã gửi yêu cầu đặt lịch tư vấn 1-1. Chúng tôi sẽ liên hệ sớm.");
    setFullName("");
    setEmail("");
    setDate("");
    setTopic("");
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0F2044] focus:ring-2 focus:ring-[#0F2044]/20";

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-8">
      <section className="app-card p-6 md:p-8">
        <p className="inline-flex rounded-full bg-[#0F2044]/10 px-3 py-1 text-xs font-semibold text-[#0F2044]">
          Tư vấn 1-1
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[#0F2044] md:text-3xl">
          Đặt lịch tư vấn 1-1
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
          Kết nối học sinh, sinh viên với chuyên gia hướng nghiệp. Điền thông tin bên dưới,
          đội ngũ sẽ xác nhận lịch qua email hoặc điện thoại.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="booking-full-name" className="text-sm font-medium text-slate-800">
              Họ và tên
            </label>
            <input
              id="booking-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nhập họ và tên"
              className={inputClass}
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="booking-email" className="text-sm font-medium text-slate-800">
              Email
            </label>
            <input
              id="booking-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              type="email"
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="booking-datetime" className="text-sm font-medium text-slate-800">
              Thời gian mong muốn
            </label>
            <input
              id="booking-datetime"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              type="datetime-local"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="booking-topic" className="text-sm font-medium text-slate-800">
              Chủ đề cần tư vấn
            </label>
            <input
              id="booking-topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Ví dụ: chọn ngành CNTT, lộ trình học sau THPT..."
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="btn-primary h-11 w-full text-sm font-semibold md:w-auto md:min-w-[200px]"
          >
            Gửi yêu cầu
          </button>
        </form>
        {notice && (
          <p
            className={`mt-4 text-sm ${
              notice.startsWith("Vui lòng") ? "text-amber-700" : "text-emerald-700"
            }`}
            role="status"
          >
            {notice}
          </p>
        )}
      </section>
    </main>
  );
}

export default BookingPage;
