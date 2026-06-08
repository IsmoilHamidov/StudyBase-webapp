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
      <div className="mt-8 rounded-2xl border border-dashed bg-white/40 p-8 text-center text-gray-500">
        Select a code block to view its content.
      </div>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl  bg-white/40 shadow-sm">
      <div className="flex items-center justify-between gap-4 b bg-gray-50 px-5 py-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {codeBlock.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Yo'nalish: {codeBlock.language}
          </p>
        </div>

        <div className="flex gap-3">
             <button
                onClick={onEdit}
                className="cursor-pointer rounded-lg bg-indigo-50 border border-violet-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                Edit
            </button>
            <button
                onClick={onDelete}
                className="cursor-pointer rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
                Delete
            </button>

            <button
                onClick={onExplain}
                disabled={explaining}
                className="rounded-lg bg-indigo-700 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {explaining
                ? "Explaining..."
                : "Explain with AI"}
            </button>
            </div>
      </div>

      <pre className="max-h-[420px] overflow-auto bg-slate-900 p-5 text-sm leading-7 text-white/80">
        <code>{codeBlock.code}</code>
      </pre>
    </section>
  );
}