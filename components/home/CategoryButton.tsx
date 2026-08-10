type CategoryButtonProps = {
  category: string;
  active: boolean;
  onClick: () => void;
};

export default function CategoryButton({
  category,
  active,
  onClick,
}: CategoryButtonProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case "All":
        return "✦";

      case "Electronics":
        return "◈";

      case "Fashion":
        return "◇";

      case "Home & Living":
        return "⌂";

      case "Beauty":
        return "✧";

      case "Sports":
        return "○";

      default:
        return "•";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-[11px] font-bold transition ${
        active
          ? "border-[#171a18] bg-[#171a18] text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      <span
        className={`grid size-6 place-items-center rounded-lg text-[10px] ${
          active
            ? "bg-zinc-700 text-lime-300"
            : "bg-zinc-100 text-zinc-600"
        }`}
      >
        {getCategoryIcon()}
      </span>

      {category}
    </button>
  );
}