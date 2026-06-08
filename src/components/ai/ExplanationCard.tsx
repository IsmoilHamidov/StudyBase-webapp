import { CodeExplanation } from "@/src/types/types";


type ExplanationCardProps = {
  item: CodeExplanation;
};

export default function ExplanationCard({
    item,
  }: ExplanationCardProps) {
    return (
      <article className="rounded-2xl border-2 border-gray-200 bg-white/20 p-5 ">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-sky-800">
            Line {item.line_number}
          </p>
        </div>
  
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          <code>{item.code_line}</code>
        </pre>
  
        <p className="mt-4 leading-7 text-gray-900">
          {item.explanation}
        </p>
      </article>
    );
  }