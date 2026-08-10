"use client";

import { ArrowRight } from "lucide-react";

import CategoryButton from "./CategoryButton";
import { categories } from "@/data/product";

type CategoriesProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export default function Categories({
  activeCategory,
  setActiveCategory,
}: CategoriesProps) {
  return (
    <section
      id="categories"
      className="mx-auto w-[calc(100%-28px)] max-w-[1720px] pt-12 sm:pt-16"
    >
      {/* Section Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
            Explore Sellexa
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            Shop by category
          </h2>
        </div>

        <a
          href="#shop"
          className="flex items-center gap-2 text-[11px] font-extrabold text-zinc-600 transition hover:text-zinc-950"
        >
          View all

          <ArrowRight size={15} />
        </a>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>
    </section>
  );
}