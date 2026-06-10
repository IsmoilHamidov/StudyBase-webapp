import { CodeExplanation } from "@/src/types/types";
import ExplanationCard from "./ExplanationCard";
import EmptyState from "../dashboard/EmptyState";

type ExplanationPanelProps = {
  summary?: string | null;
  explanations: CodeExplanation[];
  contentType?: string;  // <-- NEW
};

export default function ExplanationPanel({
  summary,
  explanations,
  contentType = "code",  // <-- NEW
}: ExplanationPanelProps) {
  if (!summary && explanations.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title="Hozircha AI tushuntirishi mavjud emas"
          description="Avval blok tugmasini bosing va har bir qator uchun sodda tushuntirish olish uchun - Batafsil tushuntirish - tugmasini bosing"
        />
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-2xl md:bg-white/40 py-6 px-0 md:p-6 md:shadow-md">
      <div className="px-2 md:px-0 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-700">
            Sun'iy intellekt ta'lim yordamchisi
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Batafsil maʼlumot
          </h2>
        </div>

        <span className="rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
          {explanations.length} ta qator
        </span>
      </div>

      {summary && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold text-gray-900">
             Umumiy xulosa
          </p>
          <p className="mt-2 leading-7 text-gray-900">
            {summary}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {explanations.map((item) => (
          <ExplanationCard
            key={item.id}
            item={item}
            contentType={contentType}  // <-- NEW
          />
        ))}
      </div>
    </section>
  );
}