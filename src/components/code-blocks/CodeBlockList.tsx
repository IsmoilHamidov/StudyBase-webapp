import { CodeBlock } from "@/src/types/types";

const contentTypeLabel: Record<string, string> = {
  code: "💻 Kod",
  math: "📐 Matematika",
  english: "🇬🇧 Ingliz tili",
  theory: "📚 Nazariya",
  other: "📝 Boshqa",
};

type CodeBlockListProps = {
  codeBlocks: CodeBlock[];
  selectedCodeBlockId: string | null;
  onSelectCodeBlock: (codeBlock: CodeBlock) => void;
  onAddCodeBlock?: () => void;
};

export default function CodeBlockList({
  codeBlocks,
  selectedCodeBlockId,
  onSelectCodeBlock,
  onAddCodeBlock,
}: CodeBlockListProps) {
  if (codeBlocks.length === 0) {
    return (
      <button
        onClick={onAddCodeBlock}
        className="w-full h-[250px] rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center hover:border-sky-400 hover:bg-blue-50 transition cursor-pointer"
      >
        <span className="text-2xl mb-2 block">＋</span>
        <p className="font-semibold text-gray-700">Hozircha bloklar yoʻq</p>
        <p className="mt-1 text-sm text-gray-500">
          Birinchi blok namunasini qoʻshing va sunʼiy intellekt uni qatorma-qator tushuntirishiga imkon bering.
        </p>
      </button>
    );
  }

  return (
    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {codeBlocks.map((block) => {
        const isActive = block.id === selectedCodeBlockId;
        return (
          <button
            key={block.id}
            onClick={() => onSelectCodeBlock(block)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              isActive
                ? "border-sky-700 bg-blue-50"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold">{block.title}</h4>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {contentTypeLabel[block.content_type ?? "other"]}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {block.code}
            </p>
          </button>
        );
      })}
    </div>
  );
}