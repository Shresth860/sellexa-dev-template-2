import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const trustPoints = [
  { icon: Truck, title: "Free Delivery", description: "On orders above ₹499" },
  { icon: ShieldCheck, title: "Secure Payments", description: "100% protected payments" },
  { icon: RotateCcw, title: "Easy Returns", description: "7-day return policy" },
  { icon: Headset, title: "24/7 Support", description: "We're here to help" },
];

export default function CartTrustBar() {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-0 sm:p-5">
      {trustPoints.map((point) => (
        <div key={point.title} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <point.icon size={14} className="shrink-0 text-zinc-500 sm:size-4" />

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold text-zinc-900 sm:text-xs">{point.title}</p>
            <p className="hidden truncate text-[10px] text-zinc-500 sm:block">{point.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
