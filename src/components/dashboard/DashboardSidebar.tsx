import { Topic } from "@/src/types/types";
import UserProfileCard from "./UserProfileCard";
import TopicList from "../topics/TopicList";
import DashboardSearch from "./DashboardSearch";

type DashboardSidebarProps = {
  topics: Topic[];
  selectedTopicId: string | null;
  onSelectTopic: (topic: Topic) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function DashboardSidebar({
  topics,
  selectedTopicId,
  onSelectTopic,
  searchTerm,
  onSearchChange,
}: DashboardSidebarProps) {
  return (
    <div className="flex flex-col h-full min-h-screen lg:min-h-0">

      {/* Logo */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <span className="text-sm font-bold text-white">S</span>
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-100">StudyBase</span>
      </div>

      {/* Topics section — grows to fill space */}
      <div className="flex-shrink-0 pt-5">
        <p className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Mavzular
        </p>
        <DashboardSearch value={searchTerm} onChange={onSearchChange} />
      </div>

      {/* Topic list — this part scrolls */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <TopicList
          topics={topics}
          selectedTopicId={selectedTopicId}
          onSelectTopic={onSelectTopic}
        />
      </div>

      {/* Profile pinned to bottom */}
      <div className="flex-shrin pt-4 border-t border-slate-800">
        <UserProfileCard />
      </div>

    </div>
  );
}