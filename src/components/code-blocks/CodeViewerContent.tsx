"use client";

import { useEffect, useRef } from "react";
import { CodeBlock } from "@/src/types/types";
import Prism from "prismjs";

interface CodeViewerContentProps {
  codeBlock: CodeBlock;
  isCode: boolean;
  language: string;
}

export default function CodeViewerContent({
  codeBlock,
  isCode,
  language,
}: CodeViewerContentProps) {
  const inlineCodeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isCode && inlineCodeRef.current) {
      Prism.plugins.autoloader.loadLanguages(language, () => {
        if (inlineCodeRef.current) Prism.highlightElement(inlineCodeRef.current);
      });
    }
  }, [codeBlock.code, language, isCode]);

  const langClass = isCode ? `language-${language}` : "language-none";

  return (
    <div className="flex h-[420px]">
      {isCode ? (
        <pre className="flex-1 min-w-0 h-full overflow-auto !bg-[#2b2b2b] p-4 sm:p-5 m-0">
          <code
            ref={inlineCodeRef}
            className={`${langClass} !text-sm xl:!text-base !leading-6 !font-normal`}
          >
            {codeBlock.code}
          </code>
        </pre>
      ) : (
        <div className="flex-1 min-w-0 h-full flex items-center justify-center bg-[#2b2b2b] p-6 text-center text-sm text-gray-400">
          Bu turdagi kontent uchun maxsus koʻrinish hali mavjud emas.
        </div>
      )}
    </div>
  );
}