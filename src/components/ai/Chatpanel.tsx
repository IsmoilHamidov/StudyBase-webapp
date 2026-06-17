"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import { askAboutLine } from "@/src/library/api";

type Message = {
  role: "user" | "ai";
  text: string;
};

type ChatPanelProps = {
  codeLine: string;
  explanation: string;
  contentType?: string;
  onClose: () => void;
};

export default function ChatPanel({
  codeLine,
  explanation,
  contentType = "code",
  onClose,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `Salom! Men ushbu qator boʻyicha savollaringizga javob berishga harakat qilaman. Nimani tushunmadingiz?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Drag state ─────────────────────────────────────────────────────────
  const panelRef = useRef<HTMLDivElement>(null);
  const originRect = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  // Capture the panel's initial (untransformed) position once, on mount
  useLayoutEffect(() => {
    if (panelRef.current && !originRect.current) {
      const rect = panelRef.current.getBoundingClientRect();
      originRect.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  }, []);

  function handleDragPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.baseX = offset.x;
    dragRef.current.baseY = offset.y;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDragPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.dragging || !originRect.current) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    let newX = dragRef.current.baseX + deltaX;
    let newY = dragRef.current.baseY + deltaY;

    // Clamp so the panel stays within the viewport
    const { left, top, width, height } = originRect.current;
    const minX = -left;
    const maxX = window.innerWidth - width - left;
    const minY = -top;
    const maxY = window.innerHeight - height - top;

    newX = Math.min(Math.max(newX, minX), maxX);
    newY = Math.min(Math.max(newY, minY), maxY);

    setOffset({ x: newX, y: newY });
  }

  function handleDragPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current.dragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const result = await askAboutLine({
        codeLine,
        existingExplanation: explanation,
        userQuestion: question,
        contentType,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: result.data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Kechirasiz, javob olishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      ref={panelRef}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className="fixed bottom-10 right-6 z-50 flex w-[370px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl"
    >
      {/* Header — drag handle */}
      <div
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
        className="flex items-center justify-between rounded-t-2xl bg-indigo-700 px-4 py-3 cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-white" />
          <p className="text-sm font-semibold text-white">
             Ai chat messenger
          </p>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="text-white/80 hover:text-white transition w-9 flex justify-center h-full "
        >
          <X size={20} />
        </button>
      </div>

      {/* Context pill — shows which line is being discussed */}
      <div className="border-b border-gray-100 bg-gray-50 px-4 pt-4 pb-5">
        <p className="text-sm text-slate-900 font-medium mb-1">Muhokamadagi qator:</p>
        <code className="block truncate rounded bg-slate-900 px-2 py-1.5 text-xs text-slate-100">
          {codeLine}
        </code>
      </div>

      {/* Messages */}
      <div className="flex max-h-74 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-base leading-7 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" />
                 Oʻylamoqda...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-100 p-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Savolingizni bering.."
          disabled={loading}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}