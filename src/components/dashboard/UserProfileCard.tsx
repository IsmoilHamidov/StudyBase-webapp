"use client";

import { supabase } from "@/src/library/supabase";
import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email ?? "");
    }
    loadUser();
  }, []);

  return (
    <div className="mb-5 xl:mb-0 my-2 overflow-x-auto rounded-xl  p-4 text-sm text-slate-100 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center
         rounded-full border-2 border-indigo-700 text-sm font-medium text-white flex-shrink-0">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate mb-0.5">
            StudyBase a'zosi
          </p>
          <p className="text-xs text-slate-400 truncate">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}