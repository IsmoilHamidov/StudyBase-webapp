import { InnerTopic } from "@/src/types/types";

type InnerTopicListProps = {
  innerTopics: InnerTopic[];
  selectedInnerTopicId: string | null;
  onSelectInnerTopic: (innerTopic: InnerTopic) => void;
  onAddInnerTopic?: () => void; // ADD
};

export default function InnerTopicList({
  innerTopics,
  selectedInnerTopicId,
  onSelectInnerTopic,
  onAddInnerTopic, // ADD
}: InnerTopicListProps) {
  if (innerTopics.length === 0) {
    return (
      <button
        onClick={onAddInnerTopic}
        className="w-full rounded-xl h-[250px] border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 hover:border-sky-400 hover:bg-blue-50 hover:text-sky-600 transition cursor-pointer"
      >
        <span className="text-2xl mb-2 block">＋</span>
        Hozircha ichki mavzular yoʻq.
      </button>
    );
  }

  return (
    <div className="grid gap-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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