import { ArrowRight } from "lucide-react";

export default function HeroSideCards() {
  return (
    <div className="hidden flex-col gap-4 p-5 lg:flex lg:justify-center">
      <div className="flex min-h-[190px] flex-col justify-between rounded-[28px] bg-[#f4e6ff] p-6 text-[#3b1b5c] shadow-sm">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#8f6aa4]">
          Trend alert
        </span>

        <strong className="text-[24px] leading-[1.05] tracking-[-0.04em]">
          Summer style
          <br />
          edit.
        </strong>

        <a
          href="#shop"
          className="inline-flex items-center gap-2 text-[11px] font-bold transition hover:text-[#5e3a9f]"
        >
          Explore now
          <ArrowRight size={14} />
        </a>
      </div>

      <div className="flex min-h-[190px] flex-col justify-between rounded-[28px] bg-[#fff6e8] p-6 shadow-sm">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#d77d3c]">
          Best deals
        </span>

        <strong className="text-[24px] leading-[1.05] tracking-[-0.04em] text-zinc-950">
          Up to 60% off
          <br />
          on footwear.
        </strong>

        <a
          href="#shop"
          className="inline-flex items-center gap-2 text-[11px] font-bold text-zinc-900 transition hover:text-[#b55d18]"
        >
          Shop offers
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
