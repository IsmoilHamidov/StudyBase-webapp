type AddInnerTopicButtonProps = {
    onClick: () => void;
    disabled?: boolean;
  };
  
  export default function AddInnerTopicButton({
    onClick,
    disabled,
  }: AddInnerTopicButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-xl bg-sky-800 px-4 py-2 font-medium text-sm text-white hover:bg-sky-900 cursor-pointer transition-all duration-200"
      >
        + Ichki mavzu qoʻshish
      </button>
    );
  }