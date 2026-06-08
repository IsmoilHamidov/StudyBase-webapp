"use client";

import { supabase } from "@/src/library/supabase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";



export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600"
    >
      <LogOut className="w-4 h-5" /> 
    </button>
  );
}