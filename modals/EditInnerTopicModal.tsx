"use client";

import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  initialTitle: string;
  onSubmit: (data: { title: string }) => Promise<void>;
}

export default function EditInnerTopicModal({
  open,
  onClose,
  initialTitle,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-xl bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">
            Ichki mavzuni tahrirlash
        </h2>

        <input
          className="w-full rounded border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Bekor qilish
          </button>

          <button
            onClick={async () => {
              await onSubmit({ title });
              onClose();
            }}
            className="rounded bg-sky-700 px-4 py-2 text-white cursor-pointer"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}