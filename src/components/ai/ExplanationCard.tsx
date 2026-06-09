"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { CodeExplanation } from "@/src/types/types";
import ChatPanel from "./Chatpanel";

import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"

// 1. Import the Autoloader plugin
import "prismjs/plugins/autoloader/prism-autoloader";

// 2. Point Prism to a public CDN for the language files
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
    // 3. Highlight content dynamically on load
    Prism.highlightAll();
  }, [item.code_line, language]);

  const isCodeType = contentType === "code";

  return (
    <>
      <article className="rounded-2xl border-2 border-gray-200 bg-white/20 p-5">
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
          {/* 4. The class name tells the autoloader what to fetch */}
          <code 
            className={`font-mono font-medium !text-[16.5px] ${
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
    </>
  );
}