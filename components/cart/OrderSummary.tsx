"use client";

import Swal from "sweetalert2";

import { Button } from "@/components/ui/Button";

type OrderSummaryProps = {
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  tax: number;
  total: number;
};

const paymentBadges = [
  {
    name: "Visa",
    content: <span className="text-[13px] font-black italic tracking-tight text-[#1a1f71]">VISA</span>,
  },
  {
    name: "Mastercard",
    content: (
      <span className="flex items-center">
        <span className="size-3.5 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: "UPI",
    content: <span className="text-[12px] font-black italic tracking-tight text-zinc-800">UPI</span>,
  },
  {
    name: "GPay",
    content: (
      <span className="text-[12px] font-bold text-zinc-700">
        <span className="text-[#4285F4]">G</span> Pay
      </span>
    ),
  },
  {
    name: "Paytm",
    content: <span className="text-[12px] font-black italic text-[#00baf2]">Paytm</span>,
  },
];

export default function OrderSummary({
  itemCount,
  subtotal,
  discount,
  couponCode,
  tax,
  total,
}: OrderSummaryProps) {
  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  const handleCheckout = () => {
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
      <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
        Order Summary
      </h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-zinc-600">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-600">
          <span>Shipping</span>
          <span className="font-semibold text-emerald-600">FREE</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span>Coupon{couponCode ? ` (${couponCode})` : ""}</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-zinc-600">
          <span>Tax (18% GST)</span>
          <span className="font-medium text-zinc-900">{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
        <span className="text-sm font-semibold text-zinc-900">Total Amount</span>
        <span className="text-xl font-black text-zinc-900">{formatPrice(total)}</span>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleCheckout}
        className="mt-5"
      >
        Proceed to Checkout
      </Button>

      <div className="mt-5">
        <p className="text-xs text-zinc-400">We accept</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {paymentBadges.map((badge) => (
            <span
              key={badge.name}
              aria-label={badge.name}
              className="flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2.5"
            >
              {badge.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
