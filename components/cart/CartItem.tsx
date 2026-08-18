"use client";

import { Trash2, Truck } from "lucide-react";

import type { Product } from "@/data/product";

type CartItemProps = {
  product: Product;
  quantity: number;
  selected: boolean;
  onToggleSelect: () => void;
  onQuantityChange: (nextQuantity: number) => void;
  onRemove: () => void;
};

function getEstimatedDelivery(productId: number) {
  const offsetDays = 3 + (productId % 5);
  const deliveryDate = new Date();
  deliveryDate.setUTCDate(deliveryDate.getUTCDate() + offsetDays);

  const day = deliveryDate.toLocaleDateString("en-GB", { day: "numeric", timeZone: "UTC" });
  const month = deliveryDate.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const weekday = deliveryDate.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });

  return `${day} ${month}, ${weekday}`;
}

function getBadgeStyle(badge: string) {
  const key = badge.toLowerCase();

  if (key.includes("best") || key.includes("top") || key.includes("editor")) {
    return "bg-indigo-50 text-indigo-600";
  }

  if (key.includes("popular") || key.includes("trend") || key.includes("hot") || key.includes("value")) {
    return "bg-purple-50 text-purple-600";
  }

  if (key.includes("new") || key.includes("launch")) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-blue-50 text-blue-600";
}

export default function CartItem({
  product,
  quantity,
  selected,
  onToggleSelect,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const inStock = product.inStock ?? true;
  const estimatedDelivery = getEstimatedDelivery(product.id);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:gap-6 sm:p-5">
      <input
        type="checkbox"
        aria-label={`Select ${product.name}`}
        checked={selected}
        onChange={onToggleSelect}
        className="size-4 shrink-0 rounded border-zinc-300 accent-zinc-900"
      />

      <img
        src={product.image}
        alt={product.name}
        className="h-28 w-28 shrink-0 rounded-xl bg-zinc-50 object-contain p-1"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-zinc-900 sm:text-lg">
          {product.name}
        </h3>

        {product.color && (
          <p className="mt-0.5 truncate text-sm text-zinc-500">Color: {product.color}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>

          {product.badge && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-start gap-1 text-sm text-zinc-600 sm:flex sm:w-36">
        <span className="flex items-center gap-1.5 font-medium text-zinc-700">
          <Truck size={15} className="shrink-0 text-zinc-400" />
          Delivery by
        </span>
        <span className="text-sm font-semibold text-zinc-900">{estimatedDelivery}</span>
        <span className="text-sm font-semibold text-emerald-600">FREE Delivery</span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label={`Remove ${product.name} from cart`}
          onClick={onRemove}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>

        <div className="flex h-9 items-center overflow-hidden rounded-full border border-zinc-200">
          <button
            type="button"
            aria-label={`Decrease quantity for ${product.name}`}
            onClick={() => onQuantityChange(quantity - 1)}
            className="flex h-full w-8 items-center justify-center text-base text-zinc-600 transition hover:bg-zinc-100"
          >
            −
          </button>

          <span className="w-8 text-center text-sm font-semibold text-zinc-900">{quantity}</span>

          <button
            type="button"
            aria-label={`Increase quantity for ${product.name}`}
            onClick={() => onQuantityChange(quantity + 1)}
            className="flex h-full w-8 items-center justify-center text-base text-zinc-600 transition hover:bg-zinc-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
