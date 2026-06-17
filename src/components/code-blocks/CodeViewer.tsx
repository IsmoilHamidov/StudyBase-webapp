"use client";

import { useState } from "react";
import { CodeBlock } from "@/src/types/types";
import CodeViewerHeader from "./CodeViewerHeader";
import CodeViewerContent from "./CodeViewerContent";
import CodeViewerModal from "@/modals/CodeViewerModal";

// Import Prism properly
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/autoloader/prism-autoloader";

// Configure autoloader
if (typeof window !== "undefined" && Prism.plugins.autoloader) {
  Prism.plugins.autoloader.languages_path =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
}

type CodeViewerProps = {
  codeBlock: CodeBlock | null;
  codeBlocks: CodeBlock[];
  onSelectCodeBlock: (block: CodeBlock) => void;
  onExplain: () => void;
  onDelete: () => void;
  onEdit: () => void;
  explaining?: boolean;
};

export default function CodeViewer({
  codeBlock,
  codeBlocks,
  onSelectCodeBlock,
  onExplain,
  onDelete,
  onEdit,
  explaining = false,
}: CodeViewerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!codeBlock) {
    return (
      <div className="mt-8 rounded-2xl border bg-white/40 p-8 text-center text-gray-500">
        Tarkibini koʻrish uchun Kontent Blokini tanlang.
      </div>
    );
  }

  const isCode = codeBlock.content_type === "code";
  const language = codeBlock?.language?.toLowerCase() || (isCode ? "python" : "none");

  return (
    <>
      <style>{`
        [data-theme="light"] code[class*="language-"],
        [data-theme="light"] pre[class*="language-"] {
          background: transparent !important;
          color: #1f2328;
          font-weight: 400;
          text-shadow: none;
        }
        [data-theme="light"] .token { font-weight: 400 !important; }
        [data-theme="light"] .token.comment,
        [data-theme="light"] .token.prolog,
        [data-theme="light"] .token.doctype,
        [data-theme="light"] .token.cdata { color: #57606a; font-style: italic; }
        [data-theme="light"] .token.keyword,
        [data-theme="light"] .token.selector,
        [data-theme="light"] .token.atrule { color: #cf222e; }
        [data-theme="light"] .token.string,
        [data-theme="light"] .token.attr-value,
        [data-theme="light"] .token.char,
        [data-theme="light"] .token.regex { color: #0a3069; }
        [data-theme="light"] .token.number,
        [data-theme="light"] .token.boolean,
        [data-theme="light"] .token.constant { color: #0550ae; }
        [data-theme="light"] .token.function { color: #8250df; }
        [data-theme="light"] .token.class-name { color: #953800; }
        [data-theme="light"] .token.variable,
        [data-theme="light"] .token.parameter { color: #0550ae; }
        [data-theme="light"] .token.builtin { color: #0550ae; }
        [data-theme="light"] .token.tag { color: #116329; }
        [data-theme="light"] .token.attr-name { color: #8250df; }
        [data-theme="light"] .token.operator,
        [data-theme="light"] .token.punctuation { color: #1f2328; }

        [data-theme="dark"] code[class*="language-"],
        [data-theme="dark"] pre[class*="language-"] {
          background: transparent !important;
          color: #d4d4d4;
        }
        [data-theme="dark"] .token { font-weight: 400 !important; }
        [data-theme="dark"] .token.comment,
        [data-theme="dark"] .token.prolog,
        [data-theme="dark"] .token.doctype,
        [data-theme="dark"] .token.cdata { color: #7c7c7c; font-style: italic; }
        [data-theme="dark"] .token.keyword,
        [data-theme="dark"] .token.selector,
        [data-theme="dark"] .token.atrule { color: #cc7832; }
        [data-theme="dark"] .token.string,
        [data-theme="dark"] .token.attr-value,
        [data-theme="dark"] .token.char,
        [data-theme="dark"] .token.regex { color: #9ece6a; }
        [data-theme="dark"] .token.number,
        [data-theme="dark"] .token.boolean,
        [data-theme="dark"] .token.constant { color: #569cd6; }
        [data-theme="dark"] .token.function { color: #ffc66d; }
        [data-theme="dark"] .token.class-name { color: #e8bf6a; }
        [data-theme="dark"] .token.variable,
        [data-theme="dark"] .token.parameter { color: #b9bcd4; }
        [data-theme="dark"] .token.builtin { color: #8888c6; }
        [data-theme="dark"] .token.tag { color: #e8bf6a; }
        [data-theme="dark"] .token.attr-name { color: #bababa; }
        [data-theme="dark"] .token.operator,
        [data-theme="dark"] .token.punctuation { color: #d4d4d4; }
      `}</style>

      {/* ── Inline card (preview) ── */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-white/40 shadow-sm">
        <CodeViewerHeader
          title={codeBlock.title}
          isCode={isCode}
          explaining={explaining}
          onOpenModal={() => setModalOpen(true)}
          onEdit={onEdit}
          onDelete={onDelete}
          onExplain={onExplain}
        />

        <CodeViewerContent
          codeBlock={codeBlock}
          isCode={isCode}
          language={language}
        />
      </section>


      <CodeViewerModal
        isOpen={modalOpen}
        codeBlock={codeBlock}
        codeBlocks={codeBlocks}
        onClose={() => setModalOpen(false)}
        onSelectCodeBlock={onSelectCodeBlock}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}