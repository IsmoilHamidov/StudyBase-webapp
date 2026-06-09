import { Topic } from "../../types/types";


interface SidebarProps {
  topics: Topic[];
}

export default function Sidebar({
  topics,
}: SidebarProps) {
  return (
    <aside className="w-72 border-r bg-white p-4">
      <h2 className="mb-6 text-xl font-bold text-black">
        Mavzular
      </h2>

      <div className="space-y-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="w-full rounded-lg border p-3 text-left transition hover:bg-gray-100"
          >
            {topic.title}
          </button>
        ))}
      </div>
    </aside>
  );
}