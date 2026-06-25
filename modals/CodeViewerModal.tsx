"use client";

import { useState, useEffect, useRef } from "react";
import { CodeBlock } from "@/src/types/types";
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  X,
  Pencil,
  Trash2,
  Code2,
  Sigma,
  Languages,
  BookOpen,
  FileText,
} from "lucide-react";
import Prism from "prismjs";
import { useRouter } from "next/navigation";

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 22];
const DEFAULT_FONT_INDEX = 4;

function getBlockIcon(contentType: string | null | undefined) {
  if (!contentType) return FileText;
  switch (contentType) {
    case "code":    return Code2;
    case "math":    return Sigma;
    case "english": return Languages;
    case "theory":  return BookOpen;
    default:        return FileText;
  }
}

// ✅ Split code into segments: comment lines are rendered as styled spans,
// non-comment lines are batched and highlighted by Prism normally.
// This prevents Prism from misreading apostrophes in Uzbek comment text as string delimiters.
function CodeWithComments({
  code,
  language,
  darkMode,
  fontSize,
}: {
  code: string;
  language: string;
  darkMode: boolean;
  fontSize: number;
}) {
  const commentColor = darkMode ? "#858d97" : "#57606a"; // VS Code dark green / GitHub gray

  const lines = code.split("\n");

  // Group consecutive non-comment lines so Prism highlights them as a block
  const segments: { type: "comment" | "code"; text: string }[] = [];
  for (const line of lines) {
    const trimmed = line.trimStart();
    const isComment = trimmed.startsWith("#");
    const last = segments[segments.length - 1];
    if (last && last.type === (isComment ? "comment" : "code")) {
      last.text += "\n" + line;
    } else {
      segments.push({ type: isComment ? "comment" : "code", text: line });
    }
  }

  const commonStyle: React.CSSProperties = {
    fontSize,
    lineHeight: 1.7,
    fontWeight: 400,
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
    display: "block",
    whiteSpace: "pre",
  };

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "comment") {
          return (
            <span
              key={i}
              style={{
                ...commonStyle,
                color: commentColor,
                // fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              {seg.text}
            </span>
          );
        }
        return (
          <PrismSegment
            key={i}
            code={seg.text}
            language={language}
            style={commonStyle}
            darkMode={darkMode}
          />
        );
      })}
    </>
  );
}

function PrismSegment({
  code,
  language,
  style,
  darkMode,
}: {
  code: string;
  language: string;
  style: React.CSSProperties;
  darkMode: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    if (Prism.languages[language]) {
      Prism.highlightElement(el);
      return;
    }

    Prism.plugins.autoloader.loadLanguages(
      [language],
      () => { if (el) Prism.highlightElement(el); },
      () => { if (el) Prism.highlightElement(el); }
    );
  }, [code, language, darkMode]);

  return (
    <code
      ref={ref}
      className={`language-${language}`}
      style={{
        ...style,
        ...(darkMode ? {} : { color: "#24292e", background: "transparent" }),
      }}
    >
      {code}
    </code>
  );
}

interface CodeViewerModalProps {
  isOpen: boolean;
  codeBlock: CodeBlock;
  codeBlocks: CodeBlock[];
  onClose: () => void;
  onSelectCodeBlock: (block: CodeBlock) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function BlockSidebar({
  blocks,
  activeBlockId,
  theme,
  onSelect,
}: {
  blocks: CodeBlock[];
  activeBlockId: string;
  theme: "dark" | "light";
  onSelect: (block: CodeBlock) => void;
}) {
  const dark = theme === "dark";

  return (
    <aside
      className={`hidden sm:flex w-48 lg:w-52 flex-shrink-0 flex-col scrollbar-thin overflow-y-auto scrollbar-thumb-black/20 ${
        dark
          ? "bg-[#1e1e1e] border-r border-white/10"
          : "bg-[#f3f3f3] border-r border-[#d0d7de]"
      }`}
    >
      <p
        className={`px-3 pt-4 pb-5 text-[11px] font-semibold uppercase tracking-wider ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Kontent Bloklari
      </p>
      <ul className="flex flex-col gap-0.5 px-1.5 pb-3">
        {blocks.map((block) => {
          const Icon = getBlockIcon(block.content_type);
          const active = block.id === activeBlockId;
          return (
            <li key={block.id}>
              <button
                onClick={() => onSelect(block)}
                title={block.title}
                className={`flex w-full items-center gap-2 rounded-md border-l-1 px-2 py-1.5 text-left text-[13px] truncate transition ${
                  active
                    ? dark
                      ? "text-gray-200"
                      : "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : dark
                    ? "border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    : "border-transparent text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{block.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default function CodeViewerModal({
  isOpen,
  codeBlock,
  codeBlocks,
  onClose,
  onSelectCodeBlock,
  onEdit,
  onDelete,
}: CodeViewerModalProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [fontIndex, setFontIndex] = useState(DEFAULT_FONT_INDEX);
  const hasPushedState = useRef(false);

  const isCode = codeBlock.content_type === "code";
  const language = codeBlock?.language?.toLowerCase() || "python";

  // Handle browser back button
  useEffect(() => {
    if (isOpen) {
      if (!hasPushedState.current) {
        window.history.pushState({ modalOpen: true }, "");
        hasPushedState.current = true;
      }
      const handlePopState = (event: PopStateEvent) => {
        if (event.state?.modalOpen === true || hasPushedState.current) {
          onClose();
          window.history.pushState({ modalOpen: true }, "");
          return;
        }
        hasPushedState.current = false;
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    } else {
      if (hasPushedState.current) {
        window.history.replaceState(null, "");
        hasPushedState.current = false;
      }
    }
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const zoomIn = () => setFontIndex((i) => Math.min(i + 1, FONT_SIZES.length - 1));
  const zoomOut = () => setFontIndex((i) => Math.max(i - 1, 0));

  const handleClose = () => {
    if (hasPushedState.current) {
      window.history.replaceState(null, "");
      hasPushedState.current = false;
    }
    onClose();
  };

  if (!isOpen || !codeBlock) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      data-theme={darkMode ? "dark" : "light"}
      style={{ background: "rgba(20,20,20,0.92)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Toolbar */}
      <div
        className={`flex flex-shrink-0 items-center justify-between gap-3 px-5 py-3 ${
          darkMode
            ? "bg-[#2b2b2b] border-b border-white/10"
            : "bg-[#f6f8fa] border-b border-[#d0d7de]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`truncate text-sm font-semibold ${
              darkMode ? "text-[#d4d4d4]" : "text-gray-900"
            }`}
          >
            {codeBlock.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={fontIndex === 0}
            className={`rounded-lg p-2 transition disabled:opacity-30 ${
              darkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ZoomOut size={18} />
          </button>

          <span className={`w-10 text-center text-sm font-mono ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {FONT_SIZES[fontIndex]}px
          </span>

          <button
            onClick={zoomIn}
            disabled={fontIndex === FONT_SIZES.length - 1}
            className={`rounded-lg p-2 transition disabled:opacity-30 ${
              darkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ZoomIn size={18} />
          </button>

          <div className={`mx-1 h-5 w-px ${darkMode ? "bg-white/15" : "bg-gray-300"}`} />

          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`rounded-lg p-2 transition ${
              darkMode ? "text-yellow-300 hover:bg-white/10" : "text-slate-600 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={`mx-1 h-5 w-px ${darkMode ? "bg-white/15" : "bg-gray-300"}`} />

          <button
            onClick={() => { handleClose(); onEdit(); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              darkMode
                ? "border border-indigo-500/40 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                : "border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            <Pencil size={15} />
            <span className="hidden md:inline-block">Tahrirlash</span>
          </button>

          <button
            onClick={() => { handleClose(); onDelete(); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              darkMode
                ? "border border-red-500/40 bg-red-600/20 text-red-300 hover:bg-red-600/30"
                : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <Trash2 size={15} />
            <span className="hidden md:inline-block">Oʻchirish</span>
          </button>

          <button
            onClick={handleClose}
            className={`ml-2 rounded-lg p-2 transition ${
              darkMode
                ? "text-gray-300 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar + Code */}
      <div className="flex flex-1 overflow-hidden">
        <BlockSidebar
          blocks={codeBlocks}
          activeBlockId={codeBlock.id}
          theme={darkMode ? "dark" : "light"}
          onSelect={onSelectCodeBlock}
        />

        <div className="flex-1 min-w-0 overflow-auto">
          <pre
            className={`min-h-full px-5 py-11 lg:px-5 !rounded-none lg:pl-9 lg:py-7 ${
              darkMode ? "!bg-[#2b2b2b]" : "!bg-white"
            }`}
            style={{ margin: 0 }}
          >
            {isCode ? (
              <CodeWithComments
                code={codeBlock.code}
                language={language}
                darkMode={darkMode}
                fontSize={FONT_SIZES[fontIndex]}
              />
            ) : (
              <code
                style={{
                  fontSize: FONT_SIZES[fontIndex],
                  lineHeight: 1.7,
                  fontWeight: 400,
                  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
                  color: darkMode ? "#d4d4d4" : "#24292e",
                }}
              >
                {codeBlock.code}
              </code>
            )}
          </pre>
        </div>
      </div>

      {/* Status bar */}
      <div
        className={`flex flex-shrink-0 items-center justify-between px-5 py-2 text-xs ${
          darkMode
            ? "bg-[#2b2b2b] border-t border-white/10 text-[#7c7c7c]"
            : "bg-[#f6f8fa] border-t border-[#d0d7de] text-[#57606a]"
        }`}
      >
        <span>{codeBlock.code.split("\n").length} qator</span>
        <span className="font-mono">studybase</span>
      </div>
    </div>
  );
}