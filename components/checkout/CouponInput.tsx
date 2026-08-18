"use client";

import { useState } from "react";
import { Check, ChevronDown, Tag, X } from "lucide-react";

type CouponDef = {
  code: string;
  type: "percent" | "flat";
  value: number;
  minSpend: number;
  label: string;
};

const AVAILABLE_COUPONS: CouponDef[] = [
  { code: "WELCOME10", type: "percent", value: 10, minSpend: 999, label: "10% off" },
  { code: "SELLEXA500", type: "flat", value: 500, minSpend: 2999, label: "₹500 off" },
  { code: "TECH1000", type: "flat", value: 1000, minSpend: 14999, label: "₹1,000 off" },
];

export type AppliedCoupon = {
  code: string;
  amount: number;
};

type CouponInputProps = {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
};

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function CouponInput({
  subtotal,
  appliedCoupon,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [promoInput, setPromoInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);

  const applyCode = (rawCode: string) => {
    const cleanCode = rawCode.trim().toUpperCase();

    if (!cleanCode) {
      setError("Please enter a coupon code");
      return;
    }

    const coupon = AVAILABLE_COUPONS.find((item) => item.code === cleanCode);

    if (!coupon) {
      setError(`"${cleanCode}" is invalid or expired`);
      return;
    }

    if (subtotal < coupon.minSpend) {
      setError(`Minimum order value for this coupon is ${formatPrice(coupon.minSpend)}`);
      return;
    }

    const amount = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

    setError(null);
    setPromoInput("");
    onApply({ code: coupon.code, amount });
  };

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault();
    applyCode(promoInput);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Tag size={18} className="text-zinc-500" />
        <h2 className="text-base font-bold text-zinc-900 sm:text-lg">Have a coupon?</h2>
      </div>

      {appliedCoupon ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
              <Check size={13} />
            </span>
            <div>
              <p className="font-mono text-sm font-bold text-emerald-800">{appliedCoupon.code}</p>
              <p className="text-xs text-emerald-700">
                You saved {formatPrice(appliedCoupon.amount)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove coupon"
            className="rounded-lg p-1.5 text-emerald-700 transition hover:bg-emerald-100"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(event) => {
              setPromoInput(event.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Enter coupon code"
            className="h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold uppercase tracking-wide text-zinc-900 outline-none placeholder:font-normal placeholder:normal-case placeholder:text-zinc-400 focus:border-zinc-800 focus:ring-2 focus:ring-zinc-100"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-[#171a18] px-4 text-sm font-bold text-white transition hover:bg-zinc-700"
          >
            Apply
          </button>
        </form>
      )}

      {error && !appliedCoupon && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={() => setIsListOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-sm font-semibold text-zinc-700 transition hover:text-zinc-900"
        >
          <span>View available coupons ({AVAILABLE_COUPONS.length})</span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
              isListOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isListOpen && (
          <div className="mt-3 space-y-2">
            {AVAILABLE_COUPONS.map((coupon) => {
              const isEligible = subtotal >= coupon.minSpend;
              const isActive = appliedCoupon?.code === coupon.code;

              return (
                <div
                  key={coupon.code}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                    isActive ? "border-emerald-200 bg-emerald-50" : "border-zinc-100 bg-zinc-50"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-900">{coupon.code}</span>
                      <span className="text-xs font-semibold text-zinc-600">{coupon.label}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      Min. order {formatPrice(coupon.minSpend)}
                    </p>
                  </div>

                  {isActive ? (
                    <span className="shrink-0 text-xs font-bold text-emerald-700">Applied</span>
                  ) : (
                    <button
                      type="button"
                      disabled={!isEligible}
                      onClick={() => applyCode(coupon.code)}
                      className="shrink-0 text-xs font-bold text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition hover:text-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-300 disabled:no-underline"
                    >
                      Apply
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
