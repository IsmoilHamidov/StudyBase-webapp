import Tooltip from "@/ui/Tooltip";


type AddInnerTopicButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function AddInnerTopicButton({
  onClick,
  disabled,
}: AddInnerTopicButtonProps) {
  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-sky-800 px-4 py-2 font-medium text-sm text-white hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
    >
      +<span className="ms-1.5 inline-block lg:hidden xl:inline-block">Ichki mavzu qoʻshish</span>
    </button>
  );

  if (disabled) {
    return (
      <Tooltip text="Avval mavzu qoʻshing">
        {/* span needed — disabled buttons don't fire mouse events */}
        <span className="inline-block">{button}</span>
      </Tooltip>
    );
  }

  return button;
}