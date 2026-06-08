import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold text-blue-400">
          AI Learning Platform
        </p>

        <h1 className="text-5xl font-bold tracking-tighttext-sm font-bold text-white">
          StudyBase
        </h1>

        <p className="mt-6 text-lg text-slate-300">
          Organize your topics, add code or notes, and let AI explain them clearly.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-sky-700  px-6 py-3 font-semibold hover:bg-sky-800 "
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl border border-slate-600 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Regiter an account
          </Link>
        </div>
      </div>
    </main>
  );
}