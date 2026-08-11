import { Search } from "lucide-react";

type EmptyProductStateProps = {
  setQuery: (value: string) => void;
  setActiveCategory: (category: string) => void;
};

export default function EmptyProductState({
  setQuery,
  setActiveCategory,
}: EmptyProductStateProps) {
  const handleClear = () => {
    setQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-zinc-100">
        <Search
          size={22}
          className="text-zinc-500"
        />
      </div>

      <h3 className="mt-4 text-lg font-bold text-zinc-900">
        No products found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Try a different product name or category.
      </p>

      <button
        type="button"
        onClick={handleClear}
        className="mt-5 rounded-xl bg-[#171a18] px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
      >
        Clear search
      </button>
    </div>
  );
}