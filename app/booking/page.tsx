"use client";

import { FormEvent, useState } from "react";

export default function BookingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName || !email || !date || !topic) {
      setMessage("Vui long nhap day du thong tin.");
      return;
    }
    setMessage("Da gui yeu cau dat lich tu van 1-1. Chung toi se lien he som.");
    setFullName("");
    setEmail("");
    setDate("");
    setTopic("");
  }

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
        <h1 className="text-3xl font-bold">Dat lich tu van 1-1</h1>
        <p className="mt-2 text-slate-600">
          Chuc nang nang cao de ket noi hoc sinh/sinh vien voi chuyen gia huong nghiep.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ho va ten"
            className="h-11 w-full rounded-xl border border-slate-200 px-3"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="h-11 w-full rounded-xl border border-slate-200 px-3"
          />
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
            type="datetime-local"
            className="h-11 w-full rounded-xl border border-slate-200 px-3"
          />
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Chu de can tu van"
            className="h-11 w-full rounded-xl border border-slate-200 px-3"
          />
          <button className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700">
            Gui yeu cau
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
      </div>
    </div>
  );
}
