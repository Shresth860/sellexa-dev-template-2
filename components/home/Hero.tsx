import { ArrowRight, Sparkles } from "lucide-react";

import HeroVisual from "./HeroVisual";
import HeroSideCards from "./HeroSideCards";

export default function Hero() {
  return (
    <section className="mx-auto mt-3 grid w-[calc(100%-28px)] max-w-[1720px] overflow-hidden rounded-[28px] border border-zinc-200/70 bg-white lg:grid-cols-[1.1fr_1.1fr_.7fr] lg:rounded-[34px]">
      {/* Hero Content */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-zinc-500">
          <Sparkles
            size={13}
            className="text-[#d8566f]"
          />
          Shop the latest styles
        </span>

        <h1 className="mt-6 max-w-xl text-[44px] font-black leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-[52px] lg:text-[62px]">
          Refresh your wardrobe
          <br />
          with curated fashion.
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-600 sm:text-[15px]">
          Discover trending apparel, footwear, and accessories from top brands.
          Shop with confidence, fast delivery, and easy returns.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#shop"
            className="inline-flex h-12 items-center gap-3 rounded-xl bg-zinc-950 px-5 text-xs font-extrabold text-white transition hover:bg-zinc-800"
          >
            Shop now
            <ArrowRight size={17} />
          </a>

          <a
            href="#categories"
            className="inline-flex h-12 items-center rounded-xl border border-zinc-200 bg-white px-5 text-xs font-extrabold text-zinc-800 transition hover:border-zinc-300"
          >
            Browse categories
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
          {[
            "Women",
            "Men",
            "Kids",
            "Footwear",
            "Bags",
            "Activewear",
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-sm"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Flat 40% off
            </p>
            <strong className="mt-2 block text-sm text-zinc-950">
              Festive fashion
            </strong>
          </div>
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Free delivery
            </p>
            <strong className="mt-2 block text-sm text-zinc-950">
              Over ₹999
            </strong>
          </div>
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Easy returns
            </p>
            <strong className="mt-2 block text-sm text-zinc-950">
              30-day exchange
            </strong>
          </div>
        </div>
      </div>

      {/* Hero Product Visual */}
      <HeroVisual />

      {/* Right Side Cards */}
      <HeroSideCards />
    </section>
  );
}
