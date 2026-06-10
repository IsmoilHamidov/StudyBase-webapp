import LogoutButton from "../auth/LogoutButton";
import AddTopicButton from "../topics/AddTopicButton";

type DashboardHeaderProps = {
  title: string;
  description?: string | null;
  onAddTopic: () => void;
  onEditTopic: () => void;
  onDeleteTopic: () => void; 
  editTopicDisabled?: boolean;
};

export default function DashboardHeader({
  title,
  description,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  editTopicDisabled,
}: DashboardHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white/40 px-6 py-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700">
          Tanlangan mavzu
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onDeleteTopic}
          disabled={editTopicDisabled}
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Mavzuni o'chirish
        </button>
        <button
          onClick={onEditTopic}
          disabled={editTopicDisabled}
          className="rounded-lg bg-violet-50 border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Mavzuni tahrirlash
        </button>
        <AddTopicButton onClick={onAddTopic} />
        <LogoutButton />
      </div>
    </header>
  );
}