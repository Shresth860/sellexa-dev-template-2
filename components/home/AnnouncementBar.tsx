import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="flex min-h-9 items-center justify-between bg-[#171a18] px-4 py-2 text-[10px] text-zinc-300 sm:px-8 lg:px-16">
      <div className="flex items-center gap-2 text-white">
        <Sparkles size={13} className="text-lime-300" />

        <span>Free shipping on orders above ₹999</span>
      </div>

      <span className="hidden sm:block">
        Premium products. Better prices. Faster delivery.
      </span>
    </div>
  );
}