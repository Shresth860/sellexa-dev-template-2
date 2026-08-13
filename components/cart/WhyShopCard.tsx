import { Gift, ShieldCheck, Truck } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Premium Quality Products",
    description: "Handpicked for you.",
  },
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    description: "On orders above ₹999.",
  },
  {
    icon: Gift,
    title: "Exclusive Offers",
    description: "Best deals for members.",
  },
];

export default function WhyShopCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="text-sm font-bold text-zinc-900 sm:text-base">
        Why shop with Sellexa?
      </h2>

      <div className="mt-4 space-y-4">
        {reasons.map((reason) => (
          <div key={reason.title} className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-700">
              <reason.icon size={16} />
            </span>

            <div>
              <p className="text-xs font-semibold text-zinc-900">{reason.title}</p>
              <p className="text-[11px] text-zinc-500">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
