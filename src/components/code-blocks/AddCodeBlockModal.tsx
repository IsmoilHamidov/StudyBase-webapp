"use client";

import { useState } from "react";

type ContentType =
  | "code"
  | "math"
  | "english"
  | "theory"
  | "other";

type AddCodeBlockModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    contentType: ContentType;
  }) => Promise<void>;
};

export default function AddCodeBlockModal({
  open,
  onClose,
  onSubmit,
}: AddCodeBlockModalProps) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] =
    useState<ContentType>("code");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setSaving(true);

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      contentType,
    });

    setTitle("");
    setContentType("code");
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
        <h2 className="text-2xl font-bold">
          Add Learning Block
        </h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          placeholder="Title: Python Variables, Present Continuous, Pythagoras..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="mt-4 w-full rounded-xl border px-4 py-3"
          value={contentType}
          onChange={(e) =>
            setContentType(
              e.target.value as ContentType
            )
          }
        >
          <option value="code">💻 Code</option>
          <option value="math">📐 Math</option>
          <option value="english">🇬🇧 English</option>
          <option value="theory">📚 Theory</option>
          <option value="other">📝 Other</option>
        </select>

        <textarea
          className="mt-4 min-h-56 w-full rounded-xl border px-4 py-3 font-mono text-sm"
          placeholder="Paste code, formula, grammar rule, theory, or any learning content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="rounded-xl bg-sky-700  px-4 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Block"}
          </button>
        </div>
      </form>
    </div>
  );
}