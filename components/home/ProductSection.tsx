"use client";

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
  onCartQuantityChange: (productId: number, nextQuantity: number) => void;
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
  onCartQuantityChange,
  onToggleWishlist,
}: ProductSectionProps) {
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
          <div className="relative">
            <label className="sr-only" htmlFor="sort-products">
              Sort products
            </label>
            <select
              id="sort-products"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="flex h-9 appearance-none items-center gap-2 rounded-xl border border-zinc-200 bg-transparent px-3 pr-8 text-[10px] text-zinc-500 outline-none transition hover:border-zinc-300"
            >
              <option value="Popular">Popular</option>
              <option value="Newest">Newest</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>

          <a
            href="#shop"
            className="flex items-center gap-2 text-[11px] font-extrabold text-zinc-600 transition hover:text-zinc-950"
          >
            View all

            <ArrowRight size={15} />
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
              quantity={0}
              onQuantityChange={(nextQuantity) =>
                onCartQuantityChange(product.id, nextQuantity)
              }
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