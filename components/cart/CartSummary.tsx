"use client";

import Swal from "sweetalert2";
import { ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";

type CartSummaryProps = {
  itemCount: number;
};

const checklist = [
  "Safe & Secure Payments",
  "100% Authentic Products",
  "7-Day Easy Returns",
];

export default function CartSummary({ itemCount }: CartSummaryProps) {
  const handleCheckout = () => {
    if (itemCount === 0) return;

    Swal.fire({
      title: "Checkout coming soon",
      text: "Order checkout isn't available yet — stay tuned!",
      icon: "info",
      confirmButtonColor: "#0f172a",
      confirmButtonText: "Got it",
      customClass: {
        popup: "rounded-3xl font-sans",
        title: "text-lg font-bold text-zinc-900",
        confirmButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",
      },
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-zinc-900 sm:text-lg">Cart Summary</h2>

      <div className="mt-6 flex justify-center">
        <div className="grid size-20 place-items-center rounded-full bg-gradient-to-b from-lime-50 to-emerald-50 sm:size-24">
          <ShoppingBag size={36} strokeWidth={1.5} className="text-emerald-600" />
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-zinc-900">
        {itemCount} {itemCount === 1 ? "Item" : "Items"} in your cart
      </p>

      <div className="mt-5 space-y-2.5">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={itemCount === 0}
        className="mt-6 flex h-14 w-full items-center justify-between rounded-full bg-[#d7f24c] px-5 text-sm font-bold text-zinc-900 transition hover:bg-[#c9e93f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to Checkout
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
          <ArrowRight size={15} />
        </span>
      </button>
    </div>
  );
}
