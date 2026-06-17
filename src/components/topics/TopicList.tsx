"use client";

import { Topic } from "@/src/types/types";



type TopicListProps = {
  topics: Topic[];
  selectedTopicId: string | null;
  onSelectTopic: (topic: Topic) => void;
};


export default function TopicList({
  topics,
  selectedTopicId,
  onSelectTopic,
}: TopicListProps) {

if (TopicList.length === 0) {
    return (
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-gray-500">
          Hozircha mavzular yoʻq. Birinchi mavzungizni qoʻshing.
        </div>
    );
    }

  return (
    <div className="space-y-2">
      {topics.map((topic) => {
        const isActive = topic.id === selectedTopicId;

        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className={`w-[80%]   py-3 text-left transition ${
              isActive
                ? "border-t-0 border-l-0 border-r-0 border border-b-slate-300 text-slate-100"
                : "text-slate-400"
            }`}
          >
            <p className="font-mediu">{topic.title}</p>
            {topic.description && (
              <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                {topic.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}