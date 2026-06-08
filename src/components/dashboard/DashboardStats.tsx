type DashboardStatsProps = {
  topicCount: number;
  innerTopicCount: number;
  codeBlockCount: number;
  explanationCount: number;
};

const accents = [
  "after:bg-indigo-500",
  "after:bg-teal-500",
  "after:bg-amber-500",
  "after:bg-violet-500",
];

export default function DashboardStats({
  topicCount,
  innerTopicCount,
  codeBlockCount,
  explanationCount,
}: DashboardStatsProps) {
  const stats = [
    { label: "Topics", value: topicCount },
    { label: "Inner Topics", value: innerTopicCount },
    { label: "Code Blocks", value: codeBlockCount },
    { label: "AI Explanations", value: explanationCount },
  ];

  return (
    <div className="mb-8 grid gap-3 md:grid-cols-4">
      {stats.map((item, i) => (
        <div
          key={item.label}
          className="relative rounded-xl border border-gray-200 bg-white/40 p-3 px-5 shadow-sm overflow-hidden"
        >
          <p className="text-sm font-medium  tracking-widest text-slate-900">
            {item.label}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
            {item.value}
          </h3>
          <div className={`mt-4 h-0.5 w-8 rounded-full ${
            i === 0 ? "bg-indigo-500" :
            i === 1 ? "bg-teal-500" :
            i === 2 ? "bg-amber-500" : "bg-violet-500"
          }`} />
        </div>
      ))}
    </div>
  );
}