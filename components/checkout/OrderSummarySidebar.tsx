"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";

export type OrderSummaryLineItem = {
  id: number;
  name: string;
  image: string;
  color?: string;
  quantity: number;
  price: number;
  oldPrice?: number;
};

type OrderSummarySidebarProps = {
  items: OrderSummaryLineItem[];
  deliveryFee?: number;
  packagingFee?: number;
  couponCode?: string | null;
  couponDiscount?: number;
  ctaLabel: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
};

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function OrderSummarySidebar({
  items,
  deliveryFee = 0,
  packagingFee = 20,
  couponCode = null,
  couponDiscount = 0,
  ctaLabel,
  onCtaClick,
  ctaDisabled = false,
}: OrderSummarySidebarProps) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemDiscount = items.reduce(
    (total, item) => total + ((item.oldPrice ?? item.price) - item.price) * item.quantity,
    0
  );
  const totalDiscount = itemDiscount + couponDiscount;
  const total = subtotal + deliveryFee + packagingFee - couponDiscount;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
        Order Summary
        <span className="ml-1.5 font-medium text-zinc-500">
          ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
      </h2>

      <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-14 w-14 shrink-0 rounded-xl bg-zinc-50 object-contain p-1"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">{item.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {item.color ? `${item.color} · ` : ""}Qty {item.quantity}
              </p>
            </div>

            <span className="shrink-0 text-sm font-bold text-zinc-900">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2.5 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
        <div className="flex items-center justify-between">
          <span>
            Price ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold text-zinc-900">{formatPrice(subtotal + itemDiscount)}</span>
        </div>

        {itemDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-semibold text-emerald-600">-{formatPrice(itemDiscount)}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex items-center justify-between">
            <span>Coupon {couponCode ? `(${couponCode})` : ""}</span>
            <span className="font-semibold text-emerald-600">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>Delivery Charges</span>
          <span className={`font-semibold ${deliveryFee === 0 ? "text-emerald-600" : "text-zinc-900"}`}>
            {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Packaging Fee</span>
          <span className="font-semibold text-zinc-900">{formatPrice(packagingFee)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
        <span className="text-base font-bold text-zinc-900">Total Amount</span>
        <div className="text-right">
          <span className="text-lg font-black text-zinc-950">{formatPrice(total)}</span>
          <p className="text-[11px] text-zinc-400">(incl. of all taxes)</p>
        </div>
      </div>

      {totalDiscount > 0 && (
        <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          Yay! You will save {formatPrice(totalDiscount)} on this order
        </div>
      )}

      <button
        type="button"
        onClick={onCtaClick}
        disabled={ctaDisabled}
        className="mt-5 flex h-14 w-full items-center justify-between rounded-full bg-[#d7f24c] px-5 text-sm font-bold text-zinc-900 transition hover:bg-[#c9e93f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ctaLabel}
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
          <ArrowRight size={15} />
        </span>
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500">
        <ShieldCheck size={14} className="text-zinc-400" />
        Safe &amp; Secure Payments
      </p>
    </div>
  );
}
