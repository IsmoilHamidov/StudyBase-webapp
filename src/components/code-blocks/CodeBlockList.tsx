"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import type { CodeBlock } from "@/src/types/types";
import Tooltip from "@/ui/Tooltip";

type CodeBlockListProps = {
  codeBlocks: CodeBlock[];
  selectedCodeBlockId: string | null;
  onSelectCodeBlock: (block: CodeBlock) => void;
  onAddCodeBlock: () => void;
  onReorder: (orderedIds: string[]) => Promise<void>;
  hasInnerTopic?: boolean;
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  code: "Kod",
  math: "Matematika",
  english: "Ingliz tili",
  theory: "Nazariya",
  other: "Boshqa",
};

const CONTENT_TYPE_COLORS: Record<string, string> = {
  code: "bg-violet-100 text-violet-700",
  math: "bg-amber-100 text-amber-700",
  english: "bg-green-100 text-green-700",
  theory: "bg-blue-100 text-blue-700",
  other: "bg-gray-100 text-gray-600",
};

export default function CodeBlockList({
  codeBlocks,
  selectedCodeBlockId,
  onSelectCodeBlock,
  onAddCodeBlock,
  onReorder,
  hasInnerTopic = false,
}: CodeBlockListProps) {
  const [items, setItems] = useState<CodeBlock[]>(codeBlocks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);

  // Only sync from parent when NOT dragging (avoids resetting mid-drag)
  useEffect(() => {
    if (!isDraggingRef.current) {
      setItems(codeBlocks);
    }
  }, [codeBlocks]);

  function handleDragStart(id: string) {
    isDraggingRef.current = true;
    setDraggingId(id);
  }

  function handleDragEnter(id: string) {
    if (id === draggingId) return;

    setItems((prev) => {
      const from = prev.findIndex((b) => b.id === draggingId);
      const to = prev.findIndex((b) => b.id === id);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function handleDragEnd() {
    isDraggingRef.current = false;
    setDraggingId(null);
    await onReorder(items.map((b) => b.id));
  }

  if (items.length === 0) {
    const emptyButton = (
      <button
        onClick={hasInnerTopic ? onAddCodeBlock : undefined}
        disabled={!hasInnerTopic}
        className="w-full border border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 py-10 text-center disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        <p className="text-sm text-gray-500">Hali kontent bloklari yo'q</p>
        <span className="text-base text-sky-700 pointer-events-none">
          + Birinchi blokni qo'shing
        </span>
      </button>
    );

    if (!hasInnerTopic) {
      return (
        <Tooltip text="Avval ichki mavzu qoʻshing" block>
          <div className="w-full">{emptyButton}</div>
        </Tooltip>
      );
    }

    return emptyButton;
  }

  return (
    <ul className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
      {items.map((block) => {
        const isSelected = block.id === selectedCodeBlockId;
        const isDragging = block.id === draggingId;
        const typeLabel =
          CONTENT_TYPE_LABELS[block.content_type ?? "code"] ?? "Kod";
        const typeColor =
          CONTENT_TYPE_COLORS[block.content_type ?? "code"] ??
          CONTENT_TYPE_COLORS.other;

        return (
          <li
            key={block.id}
            draggable
            onDragStart={() => handleDragStart(block.id)}
            onDragEnter={() => handleDragEnter(block.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-base font-medium transition-all cursor-pointer select-none ${
              isSelected
                ? "border-sky-300 bg-sky-50 text-slate-900"
                : "border-transparent bg-gray-50 text-slate-800 hover:bg-gray-100"
            } ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
            onClick={() => onSelectCodeBlock(block)}
          >
            <span
              className="cursor-grab active:cursor-grabbing text-gray-400 me-2 hover:text-gray-600 shrink-0"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical size={15} />
            </span>
            <span className="truncate flex-1">{block.title}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${typeColor}`}>
              {typeLabel}
            </span>
          </li>
        );
      })}
    </ul>
  );
}