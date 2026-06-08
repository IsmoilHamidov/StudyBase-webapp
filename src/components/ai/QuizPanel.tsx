"use client";

import { useState } from "react";
import { Brain, CheckCircle2, XCircle, RefreshCw, MessageCircleQuestionMark, MailQuestionMark, BadgeQuestionMark, Send } from "lucide-react";

export type QuizQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: "A" | "B" | "C" | "D";
};

type QuizPanelProps = {
  questions: QuizQuestion[];
  loading: boolean;
  onGenerate: () => void;
  hasExplanation: boolean;
};

type AnswerState = {
  selected: string | null;
  revealed: boolean;
};

export default function QuizPanel({
  questions,
  loading,
  onGenerate,
  hasExplanation,
}: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [score, setScore] = useState<number | null>(null);

  function handleSelect(questionIndex: number, option: string) {
    if (answers[questionIndex]?.revealed) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: { selected: option, revealed: false },
    }));
  }

  function handleReveal(questionIndex: number, correct: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        revealed: true,
      },
    }));

    // Calculate score when all questions are revealed
    const updatedAnswers = {
      ...answers,
      [questionIndex]: {
        ...answers[questionIndex],
        revealed: true,
      },
    };

    const allRevealed = questions.every(
      (_, i) => i === questionIndex || updatedAnswers[i]?.revealed
    );

    if (allRevealed) {
      const correctCount = questions.filter((q, i) => {
        const ans = i === questionIndex ? answers[questionIndex] : updatedAnswers[i];
        return ans?.selected === q.correct;
      }).length;
      setScore(correctCount);
    }
  }

  function handleReset() {
    setAnswers({});
    setScore(null);
    onGenerate();
  }

  if (!hasExplanation) return null;

  const optionLabels = ["A", "B", "C", "D"] as const;

  return (
    <section className="mt-8 rounded-2xl bg-white/40 p-6 shadow-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            AI Quiz
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Test Your Knowledge
          </h2>
        </div>

        <button
          onClick={loading ? undefined : questions.length > 0 ? handleReset : onGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              Generating...
            </>
          ) : questions.length > 0 ? (
            <>
              <RefreshCw size={15} />
              New Questions
            </>
          ) : (
            <>
              <Send  size={15} />
              Generate Quiz
            </>
          )}
        </button>
      </div>

      {/* Empty / prompt state */}
      {!loading && questions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-sky-50 p-8 text-center">
          <BadgeQuestionMark size={36} className="mx-auto mb-3 text-sky-700" />
          <p className="font-semibold text-gray-700">No quiz yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Click &quot;Generate Quiz&quot; to get 4 multiple-choice questions based on this content.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-gray-200 bg-white/40 p-5"
            >
              <div className="mb-4 h-4 w-3/4 rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-10 rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Score banner */}
      {score !== null && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
            score === questions.length
              ? "border-emerald-200 bg-emerald-50 text-slate-800"
              : score >= questions.length / 2
              ? "border-yellow-200 bg-yellow-50 text-yellow-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span className="text-2xl font-bold">
            {score}/{questions.length}
          </span>
          <span className="text-sm font-medium">
            {score === questions.length
              ? "🎉 Perfect score! Excellent work."
              : score >= questions.length / 2
              ? "👍 Good job! Keep practising."
              : "📚 Review the material and try again."}
          </span>
        </div>
      )}

      {/* Questions */}
      {!loading && questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, qi) => {
            const state = answers[qi];

            return (
              <article
                key={qi}
                className="rounded-2xl border border-gray-200 bg-white/40 p-5"
              >
                <p className="mb-4 font-semibold text-slate-900 leading-7">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                    {qi + 1}
                  </span>
                  {q.question}
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {optionLabels.map((letter) => {
                    const isSelected = state?.selected === letter;
                    const isRevealed = state?.revealed;
                    const isCorrect = letter === q.correct;

                    let optionClass =
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-md transition cursor-pointer text-left";

                    if (!isRevealed) {
                      optionClass += isSelected
                        ? " border-sky-400 bg-sky-50 font-medium ext-gray-900"
                        : " border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-900";
                    } else {
                      if (isCorrect) {
                        optionClass += " border-emerald-400 bg-emerald-50 font-medium text-gray-900";
                      } else if (isSelected && !isCorrect) {
                        optionClass += " border-red-300 bg-red-50 text-red-700";
                      } else {
                        optionClass += " border-gray-100 bg-white/60 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={letter}
                        className={optionClass}
                        onClick={() => handleSelect(qi, letter)}
                        disabled={isRevealed}
                      >
                        <span className="flex  h-7 w-7 shrink-0 items-center justify-center rounded-full bg--50 border text-sm font-medium text-gray-600">
                          {letter}
                        </span>
                        <span className="flex-1">{q.options[letter]}</span>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <XCircle size={16} className="shrink-0 text-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Check / Result button */}
                <div className="mt-3 flex items-center justify-end gap-3">
                  {state?.revealed ? (
                    <p className={`text-sm font-semibold ${state.selected === q.correct ? "text-emerald-800" : "text-red-600"}`}>
                      {state.selected === q.correct
                        ? "✓ Correct!"
                        : `✗ Correct answer: ${q.correct}`}
                    </p>
                  ) : (
                    <button
                      disabled={!state?.selected}
                      onClick={() => handleReveal(qi, q.correct)}
                      className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Check
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}