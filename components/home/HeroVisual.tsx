import { ArrowRight, Star } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden px-5 py-6 sm:px-8">
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#ffede4] via-[#fff6f1] to-[#fff7f3]" />

      <div className="absolute left-6 top-10 h-[210px] w-[180px] rounded-[36px] bg-[#fde8e1] shadow-[0_16px_40px_rgba(255,169,143,0.16)]" />
      <div className="absolute right-8 bottom-12 h-[220px] w-[200px] rounded-[36px] bg-[#f2f7ff] shadow-[0_16px_40px_rgba(143,168,255,0.16)]" />

      <div className="relative grid h-[360px] w-full max-w-[370px] place-items-center">
        <div className="absolute top-0 left-1/2 h-[260px] w-[220px] -translate-x-1/2 rounded-[30px] bg-white shadow-xl border border-zinc-200">
          <div className="absolute inset-x-0 top-0 h-24 rounded-t-[30px] bg-gradient-to-br from-[#f9d3b3] to-[#f2a98a]" />
          <div className="absolute left-4 top-24 h-32 w-32 rounded-[24px] bg-[#ffe6cf] shadow-inner" />
          <div className="absolute right-4 top-32 h-24 w-24 rounded-[24px] bg-[#fff2e8] shadow-inner" />
          <div className="absolute bottom-8 left-1/2 h-16 w-28 -translate-x-1/2 rounded-[20px] bg-[#f7ebe3] shadow-inner" />
        </div>

        <div className="absolute top-12 left-2 flex h-[96px] w-[96px] items-center justify-center rounded-[28px] bg-white shadow-lg">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#f7b8a3] to-[#d94f4f]" />
        </div>

        <div className="absolute bottom-12 right-6 flex h-[86px] w-[86px] items-center justify-center rounded-[28px] bg-white shadow-lg">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#7eb0ff] to-[#4d6cff]" />
        </div>

        <div className="absolute top-[28%] right-[20%] flex h-[108px] w-[108px] items-center justify-center rounded-[32px] bg-white shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#ffd36f] to-[#ff9b4d]" />
        </div>
      </div>

      <div className="absolute right-6 top-6 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur-md">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fde8e1] text-[#d94f4f]">
          <Star
            size={14}
            fill="currentColor"
          />
        </span>

        <div>
          <strong className="block text-xs">
            4.8/5
          </strong>
          <span className="text-[9px] text-zinc-500">
            fashion rating
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex min-w-[165px] items-center justify-between rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xl backdrop-blur-md">
        <div>
          <span className="block text-[9px] text-zinc-500">
            Starting from
          </span>
          <strong className="text-sm">
            ₹999
          </strong>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-white">
          <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
