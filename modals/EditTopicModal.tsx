"use client";

import { useEffect, useState } from "react";

type EditTopicModalProps = {
  open: boolean;
  onClose: () => void;
  initialTitle: string;
  initialDescription?: string;
  onSubmit: (data: {
    title: string;
    description?: string;
  }) => Promise<void>;
};

export default function EditTopicModal({
  open,
  onClose,
  initialTitle,
  initialDescription,
  onSubmit,
}: EditTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription ?? "");
  }, [initialTitle, initialDescription]);

  if (!open) return null;

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    setSaving(true);

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });

    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold">
          Mavzuni tahrirlash
        </h2>

        <input
          className="mt-6 w-full rounded-xl border px-4 py-3"
          placeholder="Topic title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="mt-4 w-full rounded-xl border px-4 py-3"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
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
            className="rounded-xl bg-sky-700  px-4 py-2 font-semibold text-white"
          >
            {saving
              ? "Saqlanyapti..."
              : "O'zgarishlarni saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}