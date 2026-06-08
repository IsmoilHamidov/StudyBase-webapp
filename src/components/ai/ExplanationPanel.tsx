
import { CodeExplanation } from "@/src/types/types";
import ExplanationCard from "./ExplanationCard";
import EmptyState from "../dashboard/EmptyState";



type ExplanationPanelProps = {
    summary?: string | null;
    explanations: CodeExplanation[];
  };
  
  export default function ExplanationPanel({
    summary,
    explanations,
  }: ExplanationPanelProps) {
    if (!summary && explanations.length === 0) {
      return (
        <div className="mt-8">
          <EmptyState
            title="No AI explanation yet"
            description="Select a code block and click Explain with AI to generate a simple line-by-line explanation."
          />
        </div>
      );
    }
  
    return (
      <section className="mt-8 rounded-2xl  bg-white/40 p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-700">
              AI Learning Assistant
            </p>
  
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Explanation
            </h2>
          </div>
  
          <span className="rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            {explanations.length} lines
          </span>
        </div>
  
        {summary && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-bold text-gray-900">
              Overall Summary
            </p>
  
            <p className="mt-2 leading-7 text-gray-900">
              {summary}
            </p>
          </div>
        )}
  
        <div className="space-y-4">
          {explanations.map((item) => (
            <ExplanationCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }