"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import type { InnerTopic } from "@/src/types/types";

type InnerTopicListProps = {
  innerTopics: InnerTopic[];
  selectedInnerTopicId: string | null;
  onSelectInnerTopic: (topic: InnerTopic) => void;
  onAddInnerTopic: () => void;
  onReorder: (orderedIds: string[]) => Promise<void>;
};

export default function InnerTopicList({
  innerTopics,
  selectedInnerTopicId,
  onSelectInnerTopic,
  onAddInnerTopic,
  onReorder,
}: InnerTopicListProps) {
  const [items, setItems] = useState<InnerTopic[]>(innerTopics);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);

  // Only sync from parent when NOT dragging (avoids resetting mid-drag)
  useEffect(() => {
    if (!isDraggingRef.current) {
      setItems(innerTopics);
    }
  }, [innerTopics]);

  function handleDragStart(id: string) {
    isDraggingRef.current = true;
    setDraggingId(id);
  }

  function handleDragEnter(id: string) {
    if (id === draggingId) return;

    setItems((prev) => {
      const from = prev.findIndex((t) => t.id === draggingId);
      const to = prev.findIndex((t) => t.id === id);
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
    await onReorder(items.map((t) => t.id));
  }

  if (items.length === 0) {
    return (
      <button
        onClick={onAddInnerTopic}
        className="w-full border border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 py-10 text-center cursor-pointer"
      >
        <p className="text-sm text-gray-500">Hali modullar yo'q</p>
        <span className="text-base text-sky-700 pointer-events-none">
          + Birinchi modulni qo'shing
        </span>
      </button>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
      {items.map((topic) => {
        const isSelected = topic.id === selectedInnerTopicId;
        const isDragging = topic.id === draggingId;

        return (
          <li
            key={topic.id}
            draggable
            onDragStart={() => handleDragStart(topic.id)}
            onDragEnter={() => handleDragEnter(topic.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-base font-medium transition-all cursor-pointer select-none ${
              isSelected
                ? "border-sky-300 bg-sky-50 text-slate-800"
                : "border-transparent bg-gray-50 text-slate-800 hover:bg-gray-100"
            } ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
            onClick={() => onSelectInnerTopic(topic)}
          >
            <span
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-500 shrink-0"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical size={15} />
            </span>
            <span className="truncate flex-1">{topic.title}</span>
          </li>
        );
      })}
    </ul>
  );
}