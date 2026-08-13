"use client";

import { useState } from "react";

import type { Product } from "@/data/product";

type ProductGalleryProps = {
  product: Product;
};

export default function ProductGallery({ product }: ProductGalleryProps) {
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4">
      <div className="relative overflow-hidden rounded-[22px] bg-[#f5f6f3]">
        <img
          src={productImages[selectedImage] ?? product.image}
          alt={product.name}
          className="h-[420px] w-full object-cover sm:h-[520px]"
        />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-[#ff8a1f] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {productImages.slice(0, 5).map((image, index) => {
          const isActive = selectedImage === index;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View product image ${index + 1}`}
              className={`overflow-hidden rounded-xl border transition-all ${
                isActive
                  ? "border-[#f2a15a] ring-2 ring-[#f5d7b8]"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-20 w-full object-cover sm:h-24"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
