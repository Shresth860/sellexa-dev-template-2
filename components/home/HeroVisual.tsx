import { ArrowRight, Star } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden px-5 py-6 sm:px-8">
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#ffede4] via-[#fff6f1] to-[#fff7f3]" />

      <div className="absolute left-6 top-10 h-[210px] w-[180px] rounded-[36px] bg-[#fde8e1] shadow-[0_16px_40px_rgba(255,169,143,0.16)]" />
      <div className="absolute right-8 bottom-12 h-[220px] w-[200px] rounded-[36px] bg-[#f2f7ff] shadow-[0_16px_40px_rgba(143,168,255,0.16)]" />

      <div className="relative h-[360px] w-full max-w-[370px]">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
          alt="Demo product banner"
          className="h-full w-full rounded-[30px] object-cover shadow-2xl ring-1 ring-zinc-200"
        />
      </div>

      <div className="absolute right-6 top-6 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur-md">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fde8e1] text-[#d94f4f]">
          <Star size={14} fill="currentColor" />
        </span>

        <div>
          <strong className="block text-xs">4.8/5</strong>
          <span className="text-[9px] text-zinc-500">fashion rating</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex min-w-[165px] items-center justify-between rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur-md">
        <div>
          <span className="block text-[9px] text-zinc-500">Starting from</span>
          <strong className="text-sm">₹999</strong>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-white">
          <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
