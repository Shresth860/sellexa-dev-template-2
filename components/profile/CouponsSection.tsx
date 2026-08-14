"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles, Percent, ArrowRight } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  type: string;
  description: string;
  minSpend: string;
  popular?: boolean;
  megaDeal?: boolean;
  expiresIn?: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
    iconBorder: string;
  };
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME10",
    discount: "10% OFF",
    type: "New User Offer",
    description: "Get 10% instant discount on your first order across all categories.",
    minSpend: "₹999",
    popular: true,
    expiresIn: "30 days left",
    theme: {
      badgeBg: "bg-[#d77d3c]",
      badgeText: "text-white",
      iconBg: "bg-[#fff6e8]",
      iconText: "text-[#d77d3c]",
      iconBorder: "border-[#fed7aa]",
    },
  },
  {
    id: "2",
    code: "SELLEXA500",
    discount: "₹500 OFF",
    type: "Sitewide Special",
    description: "Flat ₹500 discount on premium electronics, gadgets & fashion.",
    minSpend: "₹2,999",
    popular: true,
    expiresIn: "15 days left",
    theme: {
      badgeBg: "bg-[#5e3a9f]",
      badgeText: "text-white",
      iconBg: "bg-[#f4e6ff]",
      iconText: "text-[#5e3a9f]",
      iconBorder: "border-[#e9d5ff]",
    },
  },
  {
    id: "3",
    code: "FREESHIP",
    discount: "FREE SHIPPING",
    type: "Zero Delivery",
    description: "Enjoy zero delivery charges and express shipping on your next purchase.",
    minSpend: "₹499",
    expiresIn: "60 days left",
    theme: {
      badgeBg: "bg-emerald-600",
      badgeText: "text-white",
      iconBg: "bg-[#e6f9f0]",
      iconText: "text-emerald-700",
      iconBorder: "border-[#a7f3d0]",
    },
  },
  {
    id: "4",
    code: "STYLE25",
    discount: "25% OFF",
    type: "Lifestyle & Apparel",
    description: "Save 25% on trending clothing, luxury footwear and modern accessories.",
    minSpend: "₹1,499",
    expiresIn: "7 days left",
    theme: {
      badgeBg: "bg-[#d8566f]",
      badgeText: "text-white",
      iconBg: "bg-[#fde8e1]",
      iconText: "text-[#d8566f]",
      iconBorder: "border-[#fbd0c6]",
    },
  },
  {
    id: "5",
    code: "TECH1000",
    discount: "₹1,000 OFF",
    type: "Electronics Mega Deal",
    description: "Instant ₹1,000 off on high-performance laptops and flagship smart devices.",
    minSpend: "₹14,999",
    megaDeal: true,
    expiresIn: "10 days left",
    theme: {
      badgeBg: "bg-blue-600",
      badgeText: "text-white",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      iconBorder: "border-blue-200",
    },
  },
  {
    id: "6",
    code: "FESTIVE15",
    discount: "15% CASHBACK",
    type: "Festive Exclusive",
    description: "Get 15% cashback credited directly to your Sellexa wallet on checkout.",
    minSpend: "₹1,999",
    expiresIn: "20 days left",
    theme: {
      badgeBg: "bg-amber-600",
      badgeText: "text-white",
      iconBg: "bg-amber-50",
      iconText: "text-amber-700",
      iconBorder: "border-amber-200",
    },
  },
];

export function CouponsSection({
  triggerToast,
}: {
  triggerToast: (msg: string) => void;
}) {
  const [promoInput, setPromoInput] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    triggerToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) {
      triggerToast("Please enter a valid coupon code");
      return;
    }

    const matchedCoupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === cleanCode
    );

    if (matchedCoupon) {
      triggerToast(
        `Coupon ${matchedCoupon.code} applied! ${matchedCoupon.discount} will be applied at checkout.`
      );
      setPromoInput("");
    } else {
      triggerToast(`Coupon code "${cleanCode}" is invalid or expired.`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-r from-white via-white to-[#fffaf4] rounded-[24px] p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950">
              Coupons & Vouchers
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#fff6e8] text-[#b55d18] border border-[#fed7aa] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d77d3c]" />
              {INITIAL_COUPONS.length} Available Offers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Apply these discount codes at checkout to save extra money on your orders
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-zinc-200/90 shadow-sm">
        <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center bg-[#f5f6f3] border border-zinc-200 rounded-2xl px-4 py-3 focus-within:border-[#d77d3c] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#fff6e8] transition-all">
            <Tag className="w-4 h-4 text-[#d77d3c] shrink-0 mr-2.5" />
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="Enter promo code (e.g. WELCOME10)"
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 font-bold tracking-wide uppercase outline-none"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-7 rounded-2xl bg-[#171a18] text-white font-bold text-sm hover:bg-zinc-800 active:scale-[0.98] transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Apply Coupon</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_COUPONS.map((coupon) => {
          const isCopied = copiedCode === coupon.code;

          return (
            <div
              key={coupon.id}
              className="bg-white rounded-[24px] p-5 border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {coupon.popular && (
                <span
                  className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider ${coupon.theme.badgeBg} ${coupon.theme.badgeText} px-2.5 py-0.5 rounded-full shadow-xs`}
                >
                  POPULAR
                </span>
              )}
              {coupon.megaDeal && (
                <span
                  className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider ${coupon.theme.badgeBg} ${coupon.theme.badgeText} px-2.5 py-0.5 rounded-full shadow-xs`}
                >
                  MEGA DEAL
                </span>
              )}

              <div>
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${coupon.theme.iconBg} ${coupon.theme.iconText} border ${coupon.theme.iconBorder} flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Percent className="w-5 h-5" />
                  </div>
                  <div className="pr-16">
                    <h3 className="text-xl font-black text-zinc-950 tracking-tight">
                      {coupon.discount}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 mt-0.5">
                      {coupon.type}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 mt-3.5 font-medium leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-zinc-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-zinc-900 tracking-wider bg-[#f5f6f3] px-3.5 py-1.5 rounded-xl border border-zinc-200">
                    {coupon.code}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    Min: <strong className="text-zinc-800">{coupon.minSpend}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isCopied
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-[#171a18] text-white hover:bg-zinc-800 shadow-xs active:scale-95"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
