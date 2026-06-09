import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      {/* Logo */}
      <div
        className="absolute right-8 top-6 text-sm font-semibold tracking-tight"
      >
        <span className="text-sky-700">&lt;</span>
        <span className="mx-1.5 text-foreground">Ismoil Hamid</span>
        <span className="text-sky-700"> /&gt;</span>
      </div>

      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold text-blue-400">
            Sun'iy Intellekt Asosidagi Ta'lim Platformasi
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-white">
          StudyBase
        </h1>

        <p className="mt-6 text-lg text-slate-300">
           Mavzularingizni tartiblang, kod yoki qaydlar qo'shing va sun'iy intellekt ularni aniq tushuntirishiga imkon bering.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-sky-700 px-6 py-3 font-semibold hover:bg-sky-800"
          >
            Tizimga kirish
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold hover:bg-slate-900"
          >
             Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </main>
  );
}