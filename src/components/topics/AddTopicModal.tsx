"use client";

import { useState } from "react";

type AddTopicModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
  }) => Promise<void>;
};

export default function AddTopicModal({
  open,
  onClose,
  onSubmit,
}: AddTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    setSaving(true);

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">Mavzu qoʻshish</h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          placeholder="Mavzu nomi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="mt-4 w-full rounded-xl border px-4 py-3"
          placeholder="Tavsif (ixtiyoriy)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            className="rounded-xl bg-sky-700  px-4 py-2 font-semibold text-white"
          >
            {saving ? "Saqlanmoqda..." : "Mavzuni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}