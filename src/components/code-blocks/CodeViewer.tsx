"use client";

import { useState, useEffect, useRef } from "react";
import { CodeBlock } from "@/src/types/types";
import { Maximize2, ZoomIn, ZoomOut, Sun, Moon, X, Pencil, Trash2, Astroid } from "lucide-react";

import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/autoloader/prism-autoloader";

if (typeof window !== "undefined" && Prism.plugins.autoloader) {
  Prism.plugins.autoloader.languages_path =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
}

type CodeViewerProps = {
  codeBlock: CodeBlock | null;
  onExplain: () => void;
  onDelete: () => void;
  onEdit: () => void;
  explaining?: boolean;
};

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 22];
const DEFAULT_FONT_INDEX = 4; // 13px

export default function CodeViewer({
  codeBlock,
  onExplain,
  onDelete,
  onEdit,
  explaining = false,
}: CodeViewerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fontIndex, setFontIndex] = useState(DEFAULT_FONT_INDEX);

  const inlineCodeRef = useRef<HTMLElement>(null);
  const modalCodeRef = useRef<HTMLElement>(null);

  // Only true when content_type is explicitly "code"
  const isCode = codeBlock?.content_type === "code";

  const language =
    codeBlock?.language?.toLowerCase() || (isCode ? "python" : "none");

  // Highlight inline preview — only runs when the block is code type
  useEffect(() => {
    if (isCode && inlineCodeRef.current) {
      Prism.plugins.autoloader.loadLanguages(language, () => {
        if (inlineCodeRef.current) Prism.highlightElement(inlineCodeRef.current);
      });
    }
  }, [codeBlock?.code, language, isCode]);

  // Highlight modal code whenever modal opens or settings change
  useEffect(() => {
    if (modalOpen && modalCodeRef.current) {
      Prism.highlightElement(modalCodeRef.current);
    }
  }, [modalOpen, codeBlock?.code, language, darkMode]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const zoomIn  = () => setFontIndex((i) => Math.min(i + 1, FONT_SIZES.length - 1));
  const zoomOut = () => setFontIndex((i) => Math.max(i - 1, 0));

  if (!codeBlock) {
    return (
      <div className="mt-8 rounded-2xl border bg-white/40 p-8 text-center text-gray-500">
        Tarkibini koʻrish uchun Kontent Blokini tanlang.
      </div>
    );
  }

  const langClass = isCode ? `language-${language}` : "language-none";

  return (
    <>
      {/* ── Inline card ── */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-white/40 shadow-sm">

        {/* ── Header ── */}
        <div className="flex flex-col gap-5 bg-gray-50 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
          <div className="min-w-0">
            <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg">
              – {codeBlock.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-3">

            {/* "View Code" button — only for code blocks */}
            {isCode && (
              <button
                onClick={() => setModalOpen(true)}
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
              <Astroid size={14}/>
              {explaining ? "Tushuntirilmoqda..." : "Batafsil tushuntirish"}
            </button>
          </div>
        </div>

        {/* ── Inline preview — only rendered for code blocks ── */}
        {isCode && (
          <pre className="max-h-[420px] overflow-auto !bg-[#2b2b2b] p-4 sm:p-5">
            <code ref={inlineCodeRef} className={`${langClass} !text-sm xl:!text-base !leading-6 !font-normal`}>
              {codeBlock.code}
            </code>
          </pre>
        )}
      </section>

      {/* GitHub Light token overrides — scoped to [data-theme="light"] */}
      <style>{`
        [data-theme="light"] code[class*="language-"],
        [data-theme="light"] pre[class*="language-"] {
          background: transparent !important;
          color: #1f2328;
          font-weight: 400;
          text-shadow: none;
        }
        /* Strip all bold that okaidia theme sets */
        [data-theme="light"] .token { font-weight: 400 !important; }

        /* Comments — slate grey, italic */
        [data-theme="light"] .token.comment,
        [data-theme="light"] .token.prolog,
        [data-theme="light"] .token.doctype,
        [data-theme="light"] .token.cdata        { color: #57606a; font-style: italic; }

        /* Keywords — soft crimson (def, return, if, import…) */
        [data-theme="light"] .token.keyword,
        [data-theme="light"] .token.selector,
        [data-theme="light"] .token.atrule       { color: #cf222e; }

        /* Strings — deep navy */
        [data-theme="light"] .token.string,
        [data-theme="light"] .token.attr-value,
        [data-theme="light"] .token.char,
        [data-theme="light"] .token.regex        { color: #0a3069; }

        /* Numbers, booleans, None/True/False */
        [data-theme="light"] .token.number,
        [data-theme="light"] .token.boolean,
        [data-theme="light"] .token.constant     { color: #0550ae; }

        /* Functions — medium purple */
        [data-theme="light"] .token.function     { color: #8250df; }

        /* Class names — warm orange */
        [data-theme="light"] .token.class-name   { color: #953800; }

        /* Variables / parameters — teal */
        [data-theme="light"] .token.variable,
        [data-theme="light"] .token.parameter    { color: #0550ae; }

        /* Builtins (len, print, range…) — blue */
        [data-theme="light"] .token.builtin      { color: #0550ae; }

        /* HTML/JSX tags */
        [data-theme="light"] .token.tag          { color: #116329; }
        [data-theme="light"] .token.attr-name    { color: #8250df; }

        /* Operators & punctuation — near-black, no extra weight */
        [data-theme="light"] .token.operator,
        [data-theme="light"] .token.punctuation  { color: #1f2328; }

        /* ── Jupyter / PyCharm Darcula dark token overrides ── */
        [data-theme="dark"] code[class*="language-"],
        [data-theme="dark"] pre[class*="language-"] {
          background: transparent !important;
          color: #d4d4d4;
        }
        [data-theme="dark"] .token { font-weight: 400 !important; }

        /* Comments — muted grey, italic */
        [data-theme="dark"] .token.comment,
        [data-theme="dark"] .token.prolog,
        [data-theme="dark"] .token.doctype,
        [data-theme="dark"] .token.cdata         { color: #7c7c7c; font-style: italic; }

        /* Keywords — salmon orange (import, as, def, return, if…) */
        [data-theme="dark"] .token.keyword,
        [data-theme="dark"] .token.selector,
        [data-theme="dark"] .token.atrule        { color: #cc7832; }

        /* Strings — soft green, exactly like the screenshot */
        [data-theme="dark"] .token.string,
        [data-theme="dark"] .token.attr-value,
        [data-theme="dark"] .token.char,
        [data-theme="dark"] .token.regex         { color: #9ece6a ; }

        /* Numbers, booleans */
        [data-theme="dark"] .token.number,
        [data-theme="dark"] .token.boolean,
        [data-theme="dark"] .token.constant      { color: #569cd6; }

        /* Functions — light yellow */
        [data-theme="dark"] .token.function      { color: #ffc66d; }

        /* Class names — bright yellow */
        [data-theme="dark"] .token.class-name    { color: #e8bf6a; }

        /* Variables / parameters — light purple */
        [data-theme="dark"] .token.variable,
        [data-theme="dark"] .token.parameter     { color: #b9bcd4; }

        /* Builtins — soft teal */
        [data-theme="dark"] .token.builtin       { color: #8888c6; }

        /* HTML/JSX tags */
        [data-theme="dark"] .token.tag           { color: #e8bf6a; }
        [data-theme="dark"] .token.attr-name     { color: #bababa; }

        /* Operators & punctuation — plain light grey */
        [data-theme="dark"] .token.operator,
        [data-theme="dark"] .token.punctuation   { color: #d4d4d4; }
      `}</style>

      {/* ── Fullscreen modal — only reachable when isCode is true ── */}
      {modalOpen && isCode && (
        <div
          className="fixed inset-0 z-50 flex flex-col "
          data-theme={darkMode ? "dark" : "light"}
          style={{ background: "rgba(20,20,20,0.92)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          {/* Toolbar */}
          <div
            className={`flex flex-shrink-0 items-center justify-between gap-3 px-5 py-3 ${
              darkMode
                ? "bg-[#2b2b2b] border-b border-white/10"
                : "bg-[#f6f8fa] border-b border-[#d0d7de]"
            }`}
          >
            {/* Left: title + language badge */}
            <div className="flex min-w-0 items-center gap-3">
              <span className={`truncate text-sm font-semibold ${darkMode ? "text-[#d4d4d4]" : "text-gray-900"}`}>
                {codeBlock.title}
              </span>
            
            </div>

            {/* Right: controls */}
            <div className="flex items-center gap-2">

              {/* Zoom out */}
              <button
                onClick={zoomOut}
                disabled={fontIndex === 0}
                title="Kichiklashtirish"
                className={`rounded-lg p-2 transition disabled:opacity-30 ${
                  darkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ZoomOut size={18} />
              </button>

              {/* Font size readout */}
              <span className={`w-10 text-center text-sm font-mono ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {FONT_SIZES[fontIndex]}px
              </span>

              {/* Zoom in */}
              <button
                onClick={zoomIn}
                disabled={fontIndex === FONT_SIZES.length - 1}
                title="Kattalashtirish"
                className={`rounded-lg p-2 transition disabled:opacity-30 ${
                  darkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ZoomIn size={18} />
              </button>

              <div className={`mx-1 h-5 w-px ${darkMode ? "bg-white/15" : "bg-gray-300"}`} />

              {/* Dark / light toggle */}
              <button
                onClick={() => setDarkMode((d) => !d)}
                title={darkMode ? "Yorqin rejim" : "Qoʻngʻir rejim"}
                className={`rounded-lg p-2 transition ${
                  darkMode ? "text-yellow-300 hover:bg-white/10" : "text-slate-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className={`mx-1 h-5 w-px ${darkMode ? "bg-white/15" : "bg-gray-300"}`} />

              {/* Edit */}
              <button
                onClick={() => { setModalOpen(false); onEdit(); }}
                title="Tahrirlash"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  darkMode
                    ? "border border-indigo-500/40 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                    : "border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                <Pencil size={15} />
                <span className="hidden md:inline-block">Tahrirlash</span>
              </button>

              {/* Delete */}
              <button
                onClick={() => { setModalOpen(false); onDelete(); }}
                title="Oʻchirish"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  darkMode
                    ? "border border-red-500/40 bg-red-600/20 text-red-300 hover:bg-red-600/30"
                    : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <Trash2 size={15} />
                <span className="hidden md:inline-block">Oʻchirish</span>
              </button>

              {/* Close */}
              <button
                onClick={() => setModalOpen(false)}
                title="Yopish"
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

          {/* Scrollable code area */}
          <div className="flex-1 overflow-auto">
            <pre
              className={`min-h-full px-5 py-11  lg:px-7 lg:py-7 ${darkMode ? "!bg-[#2b2b2b]" : "!bg-white"}`}
              style={{ margin: 0 }}
            >
              <code
                ref={modalCodeRef}
                className={langClass}
                style={{
                  fontSize: FONT_SIZES[fontIndex],
                  lineHeight: 1.7,
                  fontWeight: 400,
                  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
                  ...(darkMode ? {} : { color: "#24292e", background: "transparent" }),
                }}
              >
                {codeBlock.code}
              </code>
            </pre>
          </div>

          {/* Status bar */}
          <div
            className={`flex flex-shrink-0 items-center justify-between px-5 py-2 text-xs ${
              darkMode
                ? "bg-[#2b2b2b] border-t border-white/10 text-[#7c7c7c]"
                : "bg-[#f6f8fa] border-t border-[#d0d7de] text-[#57606a]"
            }`}
          >
            <span>
              {codeBlock.code.split("\n").length} qator
            </span>
            <span className="font-mono">studybase</span>
          </div>
        </div>
      )}
    </>
  );
}