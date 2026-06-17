"use client";

import { Maximize2, Pencil, Trash2, Astroid } from "lucide-react";

interface CodeViewerHeaderProps {
  title: string;
  isCode: boolean;
  explaining: boolean;
  onOpenModal: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExplain: () => void;
}

export default function CodeViewerHeader({
  title,
  isCode,
  explaining,
  onOpenModal,
  onEdit,
  onDelete,
  onExplain,
}: CodeViewerHeaderProps) {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
      <div className="min-w-0">
        <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg">
          – {title}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-3">
        {/* "View Code" button — only for code blocks */}
        {isCode && (
          <button
            onClick={onOpenModal}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition sm:px-4 sm:py-2 sm:text-sm"
          >
            <Maximize2 size={16} />
            Koʻrish
          </button>
        )}

        <button
          onClick={onEdit}
          className="cursor-pointer rounded-lg bg-indigo-50 border border-violet-200 px-3 py-2 text-center text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition sm:px-4 sm:py-2 sm:text-sm"
        >
          Tahrirlash
        </button>

        <button
          onClick={onDelete}
          className="cursor-pointer rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center text-xs font-medium text-red-700 hover:bg-red-100 transition sm:px-4 sm:py-2 sm:text-sm"
        >
          Oʻchirish
        </button>

        <button
          onClick={onExplain}
          disabled={explaining}
          className="flex items-center gap-x-2 col-span-2 rounded-lg bg-indigo-700 cursor-pointer px-4 py-2 text-center text-xs font-medium text-white hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition sm:col-span-1 sm:text-sm"
        >
          <Astroid size={14} />
          {explaining ? "Tushuntirilmoqda..." : "Batafsil tushuntirish"}
        </button>
      </div>
    </div>
  );
}