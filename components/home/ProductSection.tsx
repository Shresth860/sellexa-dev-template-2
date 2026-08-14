"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import ProductCard from "./ProductCard";
import EmptyProductState from "./EmptyProductState";
import type { Product } from "@/data/product";

type ProductSectionProps = {
  products: Product[];
  query: string;
  activeCategory: string;
  setQuery: (value: string) => void;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onToggleWishlist: (productId: number, isActive: boolean) => void;
};

export default function ProductSection({
  products,
  query,
  activeCategory,
  setQuery,
  setActiveCategory,
  sortBy,
  setSortBy,
  onToggleWishlist,
}: ProductSectionProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const sortOptions = [
    "Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      id="shop"
      className="mx-auto w-[calc(100%-28px)] max-w-[1720px] py-12 sm:py-16"
    >
      {/* Section Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
            Selected for you
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
            {query
              ? `Results for "${query}"`
              : activeCategory === "All"
                ? "Trending right now"
                : activeCategory}
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-5">
          <div ref={sortRef} className="relative z-30">
            <label className="sr-only" htmlFor="sort-products">
              Sort products
            </label>

            <button
              id="sort-products"
              type="button"
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
              onClick={() => setIsSortOpen((open) => !open)}
              className="flex h-11 min-w-[190px] items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/90 px-3.5 pr-3 text-sm font-medium text-zinc-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] outline-none transition duration-200 hover:border-zinc-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)] focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            >
              <span className="truncate">{sortBy}</span>
              <ChevronDown
                size={14}
                className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[220px] overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                {sortOptions.map((option) => {
                  const isSelected = option === sortBy;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-zinc-950 text-white shadow-sm"
                          : "bg-transparent text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="#shop"
            className="flex items-center gap-2 text-sm font-extrabold text-zinc-600 transition hover:text-zinc-950"
          >
            View all

            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleWishlist={(isActive) => onToggleWishlist(product.id, isActive)}
            />
          ))}
        </div>
      ) : (
        <EmptyProductState
          setQuery={setQuery}
          setActiveCategory={setActiveCategory}
        />
      )}
    </section>
  );
}