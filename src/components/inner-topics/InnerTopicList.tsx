import { InnerTopic } from "@/src/types/types";


type InnerTopicListProps = {
  innerTopics: InnerTopic[];
  selectedInnerTopicId: string | null;
  onSelectInnerTopic: (innerTopic: InnerTopic) => void;
};

export default function InnerTopicList({
  innerTopics,
  selectedInnerTopicId,
  onSelectInnerTopic,
}: InnerTopicListProps) {
  if (innerTopics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500">
         Hozircha ichki mavzular yoʻq.
      </div>
    );
  }

  return (
    <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-2   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {innerTopics.map((item) => {
        const isActive = item.id === selectedInnerTopicId;

        return (
          <button
            key={item.id}
            onClick={() => onSelectInnerTopic(item)}
            className={`rounded-xl border p-4 text-left transition ${
              isActive
                ? "border-sky-700 bg-blue-50"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <h3 className="font-semibold">{item.title}</h3>
          </button>
        );
      })}
    </div>
  );
}