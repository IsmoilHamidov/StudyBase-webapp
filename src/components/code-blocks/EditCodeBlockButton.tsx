type EditCodeBlockButtonProps = {
    onClick: () => void;
    disabled?: boolean;
  };
  
  export default function EditCodeBlockButton({
    onClick,
    disabled,
  }: EditCodeBlockButtonProps) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:bg-gray-400"
      >
        Edit
      </button>
    );
  }