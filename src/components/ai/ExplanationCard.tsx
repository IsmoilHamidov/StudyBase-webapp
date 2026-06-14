"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { CodeExplanation } from "@/src/types/types";
import ChatPanel from "./Chatpanel";

import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"

import "prismjs/plugins/autoloader/prism-autoloader";

if (typeof window !== "undefined" && Prism.plugins.autoloader) {
  Prism.plugins.autoloader.languages_path = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
}

type ExplanationCardProps = {
  item: CodeExplanation;
  contentType?: string;
  language?: string; 
};

export default function ExplanationCard({
  item,
  contentType = "code",
  language = "python", 
}: ExplanationCardProps) {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [item.code_line, language]);

  const isCodeType = contentType === "code";

  return (
    <>
      <article className="rounded-2xl border-2 border-gray-200 bg-white/20 p-5" data-theme="dark">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-sky-800">
           Qator {item.line_number}
          </p>

          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
          >
            <MessageCircle size={13} />
             Soʻrash
          </button>
        </div>

        <pre className="overflow-x-auto rounded-xl !bg-slate-900 p-4">
          <code 
            className={`font-mono font-normal !text-[16.5px] ${
              isCodeType ? `language-${language.toLowerCase()}` : "language-none"
            }`}
          >
            {item.code_line}
          </code>
        </pre>

        <p className="mt-4 leading-7 text-gray-900 text-[16.5px]">
          {item.explanation}
        </p>
      </article>

      {chatOpen && (
        <ChatPanel
          codeLine={item.code_line}
          explanation={item.explanation}
          contentType={contentType}
          onClose={() => setChatOpen(false)}
        />
      )}

      <style jsx global>{`
        [data-theme="dark"] code[class*="language-"],
        [data-theme="dark"] pre[class*="language-"] {
          background: transparent !important;
          color: #d4d4d4;
        }
        [data-theme="dark"] .token { font-weight: 400 !important; }

        [data-theme="dark"] .token.comment,
        [data-theme="dark"] .token.prolog,
        [data-theme="dark"] .token.doctype,
        [data-theme="dark"] .token.cdata         { color: #7c7c7c; font-style: italic; }

        [data-theme="dark"] .token.keyword,
        [data-theme="dark"] .token.selector,
        [data-theme="dark"] .token.atrule        { color: #cc7832; }

        [data-theme="dark"] .token.string,
        [data-theme="dark"] .token.attr-value,
        [data-theme="dark"] .token.char,
        [data-theme="dark"] .token.regex         { color: #9ece6a; }

        [data-theme="dark"] .token.number,
        [data-theme="dark"] .token.boolean,
        [data-theme="dark"] .token.constant      { color: #6897bb; }

        [data-theme="dark"] .token.function      { color: #ffc66d; }

        [data-theme="dark"] .token.class-name    { color: #e8bf6a; }

        [data-theme="dark"] .token.variable,
        [data-theme="dark"] .token.parameter     { color: #b9bcd4; }

        [data-theme="dark"] .token.builtin       { color: #8888c6; }

        [data-theme="dark"] .token.tag           { color: #e8bf6a; }
        [data-theme="dark"] .token.attr-name     { color: #bababa; }

        [data-theme="dark"] .token.operator,
        [data-theme="dark"] .token.punctuation   { color: #d4d4d4; }
      `}</style>
    </>
  );
}