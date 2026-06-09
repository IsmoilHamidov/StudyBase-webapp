"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/library/supabase";
import { CodeBlock, InnerTopic, Topic } from "@/src/types/types";
import Image from "next/image";
import googleLogo from "../../../public/Images/Logo-google-icon-PNG-removebg-preview.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTopic, setSelectedTopic] =
    useState<Topic | null>(null);

    const [selectedInnerTopic, setSelectedInnerTopic] =
    useState<InnerTopic | null>(null);

    const [selectedCodeBlock, setSelectedCodeBlock] =
    useState<CodeBlock | null>(null);
    async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-white/10 p-8">
        <h1 className="text-2xl font-bold">Xush kelibsiz!</h1>

        <input
          className="mt-6 w-full rounded-xl px-4 py-3 text-white border border-white/20"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl px-4 py-3 text-white border border-white/20"
          placeholder="Parol"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mt-7 w-full rounded-xl bg-sky-700  py-3 font-semibold cursor-pointer">
          Kirish
        </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-x-3 mt-3 w-full rounded-xl
             border border-slate-500 py-3 font-semibold cursor-pointer"
          >
            <Image
                src={googleLogo}
                alt="Google"
                width={20}
                height={20}
              />
            <span>Google orqali davom ettirish</span>
          </button>


        <p className="mt-6 text-sm text-slate-300">
           Hisobingiz yoʻqmi?<Link href="/register" className="text-blue-400 ms-1">Roʻyxatdan oʻtish</Link>
        </p>
      </form>
    </main>
  );
}