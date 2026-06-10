import { CodeBlock } from "@/src/types/types";

type CodeViewerProps = {
    codeBlock: CodeBlock | null;
    onExplain: () => void;
    onDelete: () => void;
    onEdit: () => void;
    explaining?: boolean;
  };

  export default function CodeViewer({
    codeBlock,
    onExplain,
    onDelete,
    onEdit,
    explaining = false,
  }: CodeViewerProps) {
  if (!codeBlock) {
    return (
      <div className="mt-8 rounded-2xl border  bg-white/40 p-8 text-center text-gray-500">
         Tarkibini koʻrish uchun Kontent Blokini tanlang.
      </div>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-white/40 shadow-sm">
      {/* Flex layout converts to column on mobile view, drops row background safely into alignment */}
      <div className="flex flex-col gap-5 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        
        {/* Text info layout wrappers */}
        <div className="min-w-0">
          <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg">
            – {codeBlock.title}
          </h3>

          {/* <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Yo'nalish: <span className="font-mono bg-gray-200/60 px-1.5 py-0.5 rounded text-gray-700">{codeBlock.language}</span>
          </p> */}
        </div>

        {/* Responsive actions matrix container */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-3">
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

          {/* AI trigger action spans full width under edit/delete on tiny devices */}
          <button
            onClick={onExplain}
            disabled={explaining}
            className="col-span-2 rounded-lg bg-indigo-700 cursor-pointer px-4 py-2 text-center text-xs font-medium text-white hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition sm:col-span-1 sm:text-sm"
          >
            {explaining ? "Tushuntirilmoqda..." : "Batafsil tushuntirish"}
          </button>
        </div>
      </div>

      {/* Code panel padding optimized for mobile blocks */}
      <pre className="max-h-[420px] overflow-auto bg-slate-900 p-4 font-mono text-xs leading-6 text-white/80 sm:p-5 sm:text-sm sm:leading-7">
        <code>{codeBlock.code}</code>
      </pre>
    </section>
  );
}