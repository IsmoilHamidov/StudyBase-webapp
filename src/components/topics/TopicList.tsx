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
        No topics yet. Add your first topic.
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
            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-indigo-700 bg-blue-50 text-indigo-800"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="font-semibold">{topic.title}</p>
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