import Tooltip from "@/ui/Tooltip";

type AddCodeBlockButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function AddCodeBlockButton({
  onClick,
  disabled,
}: AddCodeBlockButtonProps) {
  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-sky-800 px-4 py-2 font-medium text-sm text-white hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
    >
      +<span className="ms-1.5 inline-block lg:hidden xl:inline-block">Blok qoʻshish</span>
    </button>
  );

  if (disabled) {
    return (
      <Tooltip text="Avval ichki mavzu qoʻshing">
        <span className="inline-block">{button}</span>
      </Tooltip>
    );
  }

  return button;
}