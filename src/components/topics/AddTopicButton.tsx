type AddTopicButtonProps = {
    onClick: () => void;
  };
  
  export default function AddTopicButton({
    onClick,
  }: AddTopicButtonProps) {
    return (
      <button
        onClick={onClick}
        className="rounded-xl bg-sky-800 px-4 py-2  text-sm font-medium text-white hover:bg-sky-900 cursor-pointer transition-all duration-200"
      >
        + Mavzu qoʻshish
      </button>
    );
  }