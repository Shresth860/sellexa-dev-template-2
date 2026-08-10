"use client";

import { Heart, Star } from "lucide-react";

import type { Product } from "@/data/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  return (
    <article
      id={`product-${product.id}`}
      className="group overflow-hidden rounded-[20px] border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,33,28,0.09)]"
    >
      {/* Product Image */}
      <div className="relative m-2 aspect-square overflow-hidden rounded-2xl bg-zinc-100">
        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-lg bg-white/90 px-2 py-1.5 text-[8px] font-extrabold shadow-sm backdrop-blur">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/90 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-zinc-950 hover:text-white"
        >
          <Heart size={16} />
        </button>

        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="p-3 pb-4 sm:p-4">
        {/* Category */}
        <p className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-zinc-400">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="mt-1 line-clamp-1 text-sm font-bold tracking-tight text-zinc-900">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1 text-[10px]">
          <Star
            size={11}
            fill="currentColor"
            className="text-amber-500"
          />

          <span className="font-semibold">
            {product.rating}
          </span>

          <span className="text-zinc-400">
            ({product.reviews})
          </span>
        </div>

        {/* Price + Cart */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <strong className="text-sm font-black tracking-tight sm:text-base">
              {formatPrice(product.price)}
            </strong>

            {product.oldPrice && (
              <del className="ml-1.5 text-[9px] text-zinc-400">
                {formatPrice(product.oldPrice)}
              </del>
            )}
          </div>

          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-900 transition hover:bg-[#171a18] hover:text-white"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}