import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCartState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-zinc-100">
        <ShoppingBag
          size={22}
          className="text-zinc-500"
        />
      </div>

      <h3 className="mt-4 text-lg font-bold text-zinc-900">
        Your cart is empty
      </h3>

      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Looks like you haven&apos;t added anything yet. Start browsing to find something you&apos;ll love.
      </p>

      <Link
        href="/"
        className="mt-5 rounded-xl bg-[#171a18] px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
      >
        Start Shopping
      </Link>
    </div>
  );
}
