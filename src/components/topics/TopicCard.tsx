import { Topic } from "../../types/types";


interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({
  topic,
}: TopicCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        {topic.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {topic.description}
      </p>
    </div>
  );
}