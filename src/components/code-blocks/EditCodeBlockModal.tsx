"use client";

import { useEffect, useState } from "react";
import type { CodeBlock } from "@/src/types/types";

type ContentType = "code" | "math" | "english" | "theory" | "other";

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
  const [contentType, setContentType] = useState<ContentType>("code");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (codeBlock) {
      setTitle(codeBlock.title);
      setContentType((codeBlock.content_type as ContentType) ?? "code");
      setContent(codeBlock.code);
    }
  }, [codeBlock]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    // Keep the backend contract: language carries content_type, code carries content
    await onSubmit({
      title: title.trim(),
      language: contentType,
      code: content.trim(),
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
        <h2 className="text-2xl font-bold">Blokni tahrirlash</h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          placeholder="Sarlavha: Python oʻzgaruvchilari, Present Continuous, Pifagor..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="mt-4 w-full rounded-xl border px-4 py-3"
          value={contentType}
          onChange={(e) => setContentType(e.target.value as ContentType)}
        >
          <option value="code">💻 Kod</option>
          <option value="math">📐 Matematika</option>
          <option value="english">🇬🇧 Ingliz tili</option>
          <option value="theory">📚 Nazariya</option>
          <option value="other">📝 Boshqa</option>
        </select>

        <textarea
          className="mt-4 min-h-56 w-full rounded-xl border px-4 py-3 font-mono text-sm"
          placeholder="Kod, formula, grammatika qoidasi, nazariya yoki ixtiyoriy oʻquv kontentini joylashtiring..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
          >
            Bekor qilish
          </button>

          <button
            disabled={saving}
            className="rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}