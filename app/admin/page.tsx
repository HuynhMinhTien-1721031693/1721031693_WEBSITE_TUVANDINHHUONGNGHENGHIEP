export default function AdminPage() {
  const cards = [
    { title: "Tong so nguoi dung", value: "1,284" },
    { title: "Luot lam quiz", value: "4,932" },
    { title: "Lich tu van 1-1", value: "86" },
    { title: "Bai viet blog", value: "24" },
  ];

  return (
    <div className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5 md:p-8">
          <h1 className="text-3xl font-bold">Dashboard quan tri (Admin)</h1>
          <p className="mt-2 text-slate-600">
            Khu vuc quan ly nguoi dung, du lieu quiz, lich tu van va noi dung blog.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl bg-white p-5 shadow ring-1 ring-black/5">
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-bold text-blue-700">{card.value}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
