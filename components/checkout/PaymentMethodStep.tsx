"use client";

import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";

export type PaymentMethod = "cod" | "upi" | "card" | "netbanking" | "wallet";

type PaymentOption = {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    title: "Cash on Delivery (COD)",
    description: "Pay in cash when your order is delivered",
    icon: Banknote,
    badge: "Recommended",
  },
  {
    id: "upi",
    title: "UPI",
    description: "Google Pay, PhonePe, Paytm UPI & more",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay & more",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "Net Banking",
    description: "All major banks supported",
    icon: Landmark,
  },
  {
    id: "wallet",
    title: "Wallets",
    description: "Paytm, Amazon Pay, Mobikwik & more",
    icon: Wallet,
  },
];

type PaymentMethodStepProps = {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
};

export default function PaymentMethodStep({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodStepProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-zinc-500" />
        <h2 className="text-base font-bold text-zinc-900 sm:text-lg">Payment Method</h2>
      </div>

      <div className="mt-4 space-y-3">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = option.id === selectedMethod;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectMethod(option.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                isSelected
                  ? "border-zinc-950 bg-zinc-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                  isSelected ? "border-zinc-950" : "border-zinc-300"
                }`}
              >
                {isSelected && <span className="size-2.5 rounded-full bg-zinc-950" />}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900">{option.title}</span>
                  {option.badge && (
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">{option.description}</p>
              </div>

              <Icon size={20} className="shrink-0 text-zinc-400" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={15} className="shrink-0" />
        Safe and secure payments. Easy returns. 100% authentic products.
      </div>
    </div>
  );
}
