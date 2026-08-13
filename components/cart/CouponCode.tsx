"use client";

import { useState } from "react";
import { BadgePercent, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

export type AppliedCoupon = {
  code: string;
  label: string;
};

type CouponCodeProps = {
  appliedCoupon: AppliedCoupon | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
};

export default function CouponCode({
  appliedCoupon,
  onApply,
  onRemove,
}: CouponCodeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    const success = onApply(trimmed);
    if (success) {
      setCode("");
      setError("");
    } else {
      setError("Invalid or expired coupon code");
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <BadgePercent size={18} className="text-emerald-600" />
        <h2 className="text-base font-bold text-zinc-900 sm:text-lg">
          Coupon Code
        </h2>
      </div>

      {appliedCoupon ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-emerald-700">
              {appliedCoupon.code}
            </p>
            <p className="truncate text-xs text-emerald-600">
              {appliedCoupon.label}
            </p>
          </div>

          <button
            type="button"
            aria-label="Remove coupon"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-100"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleApply();
                }
              }}
              placeholder="Enter coupon code"
              className="h-11 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm font-medium uppercase text-zinc-900 outline-none placeholder:text-zinc-400 placeholder:normal-case focus:border-zinc-400"
            />

            <Button type="button" size="md" onClick={handleApply}>
              Apply
            </Button>
          </div>

          {error && (
            <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
          )}

          <p className="mt-3 text-xs text-zinc-400">Try SAVE10 or FLAT500</p>
        </>
      )}
    </div>
  );
}
