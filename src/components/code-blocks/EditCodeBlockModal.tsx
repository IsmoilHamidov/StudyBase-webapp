"use client";

import { CodeBlock } from "@/src/types/types";
import { useEffect, useState } from "react";

type EditCodeBlockModalProps = {
  open: boolean;
  codeBlock: CodeBlock | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    language: string;
    code: string;
  }) => Promise<void>;
};

export default function EditCodeBlockModal({
  open,
  codeBlock,
  onClose,
  onSubmit,
}: EditCodeBlockModalProps) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!codeBlock) return;

    setTitle(codeBlock.title);
    setLanguage(codeBlock.language);
    setCode(codeBlock.code);
  }, [codeBlock]);

  if (!open || !codeBlock) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !code.trim()) return;

    setSaving(true);

    await onSubmit({
      title: title.trim(),
      language,
      code: code.trim(),
    });

    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">Kod blokini tahrirlash</h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="mt-4 w-full rounded-xl border px-4 py-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="dart">Dart</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>

        <textarea
          className="mt-4 min-h-56 w-full rounded-xl border px-4 py-3 font-mono text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
          >
            Bekor qilish
          </button>

          <button
            disabled={saving}
            className="rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white"
          >
            {saving ? "Saqlanmoqda..." : "Oʻzgarishlarni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}