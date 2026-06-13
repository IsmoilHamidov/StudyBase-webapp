"use client";

import { useState } from "react";

type ContentType = "code" | "math" | "english" | "theory" | "other";

const LANGUAGE_MAP: Record<Exclude<ContentType, "code">, string> = {
  math: "latex",
  english: "plaintext",
  theory: "plaintext",
  other: "plaintext",
};

const CODE_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "sql",
  "bash",
  "other",
];

type AddCodeBlockModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    contentType: ContentType;
    language: string;           // ← added
  }) => Promise<void>;
};

export default function AddCodeBlockModal({
  open,
  onClose,
  onSubmit,
}: AddCodeBlockModalProps) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("code");
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  function resolvedLanguage(): string {
    if (contentType === "code") return codeLanguage;
    return LANGUAGE_MAP[contentType];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      contentType,
      language: resolvedLanguage(),   // ← pass it
    });

    setTitle("");
    setContentType("code");
    setCodeLanguage("python");
    setContent("");
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">Oʻquv blokini qoʻshish</h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          placeholder="Sarlavha: Python oʻzgaruvchilari, Present Continuous, Pifagor..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content type and language on the same row when code is selected */}
        <div className="mt-4 flex gap-3">
          <select
            className="w-full rounded-xl border px-4 py-3"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
          >
            <option value="code">💻 Kod</option>
            <option value="math">📐 Matematika</option>
            <option value="english">🇬🇧 Ingliz tili</option>
            <option value="theory">📚 Nazariya</option>
            <option value="other">📝 Boshqa</option>
          </select>

          {/* Only show language picker for code blocks */}
          {contentType === "code" && (
            <select
              className="w-full rounded-xl border px-4 py-3 capitalize"
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
            >
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="capitalize">
                  {lang}
                </option>
              ))}
            </select>
          )}
        </div>

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
            {saving ? "Saqlanmoqda..." : "Blokni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}