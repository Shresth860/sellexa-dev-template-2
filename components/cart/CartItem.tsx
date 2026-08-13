"use client";

import { Trash2 } from "lucide-react";

import type { Product } from "@/data/product";

type CartItemProps = {
  product: Product;
  quantity: number;
  onQuantityChange: (nextQuantity: number) => void;
  onRemove: () => void;
};

export default function CartItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
  const inStock = product.inStock ?? true;

  const specs =
    product.keywords && product.keywords.length > 0
      ? [product.category, ...product.keywords.slice(0, 2)]
      : [product.category];

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <button
        type="button"
        aria-label={`Remove ${product.name} from cart`}
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 sm:right-4 sm:top-4"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-stretch gap-6 pr-8">
        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 shrink-0 rounded-xl bg-zinc-50 object-contain p-0 sm:h-36 sm:w-36"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-zinc-900 sm:text-xl">
              {product.name}
            </h3>

            <p className="mt-0.5 truncate text-base text-zinc-500">
              {specs.join(" | ")}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              {product.color && (
                <span className="flex items-center gap-1.5 text-base font-medium text-zinc-700">
                  <span
                    className="size-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: product.color.toLowerCase() }}
                  />
                  {product.color}
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-3">
            <span className="text-lg font-bold text-zinc-900 sm:text-xl">
              {formatPrice(product.price)}
            </span>

            <div className="flex h-11 items-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
              <button
                type="button"
                aria-label={`Decrease quantity for ${product.name}`}
                onClick={() => onQuantityChange(quantity - 1)}
                className="flex h-full w-10 items-center justify-center text-lg text-zinc-600 transition hover:bg-zinc-100"
              >
                −
              </button>

              <span className="w-10 text-center text-lg font-semibold text-zinc-900">
                {quantity}
              </span>

              <button
                type="button"
                aria-label={`Increase quantity for ${product.name}`}
                onClick={() => onQuantityChange(quantity + 1)}
                className="flex h-full w-10 items-center justify-center text-lg text-zinc-600 transition hover:bg-zinc-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
