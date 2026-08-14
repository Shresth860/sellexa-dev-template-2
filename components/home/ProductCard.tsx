"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import type { Product } from "@/data/product";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
  onToggleWishlist?: (isActive: boolean) => void;
};

export default function ProductCard({
  product,
  onToggleWishlist,
}: ProductCardProps) {
  const { cartItems, addToCart, updateCartQuantity } = useCart();
  const quantity = cartItems[product.id] ?? 0;
  const formatPrice = (price: number) =>
    `₹${price.toLocaleString("en-IN")}`;

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : null;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const activeImage =
    productImages[selectedImage] || product.image;

  const handleWishlistToggle = () => {
    const nextValue = !isWishlisted;
    setIsWishlisted(nextValue);
    onToggleWishlist?.(nextValue);
  };

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const handleQuantityChange = (delta: number) => {
    updateCartQuantity(product.id, Math.max(0, quantity + delta));
  };

  return (
    <article
      id={`product-${product.id}`}
      className="
        group
        w-full
        max-w-[300px]
        overflow-hidden
        rounded-[20px]
        border
        border-[#dfe3e8]
        bg-white
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]
      "
    >
      {/* =====================================================
          MAIN PRODUCT IMAGE
      ====================================================== */}

      <div
        className="
          relative
          h-[190px]
          w-full
          overflow-hidden
          rounded-t-[20px]
        "
      >
        <Link
          href={`/product/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="block h-full w-full"
        >
          <img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            className="
              absolute
              inset-0
              block
              h-full
              w-full
              object-cover
              transition-transform
              duration-200
              group-hover:scale-[1.03]
            "
          />
        </Link>

        {/* =================================================
            DISCOUNT / BADGE
        ================================================== */}

        {(product.badge || discount) && (
          <div
            className="
              absolute
              left-0
              top-0
              z-20
              rounded-br-[8px]
              bg-[#ff8a1f]
              px-3
              py-[7px]
              text-[10px]
              font-bold
              leading-none
              text-white
            "
          >
            {product.badge || `${discount}% OFF`}
          </div>
        )}

        <button
          type="button"
          aria-label={`Wishlist ${product.name}`}
          onClick={handleWishlistToggle}
          className={`
            absolute
            right-2.5
            top-2.5
            z-20
            grid
            place-items-center
            rounded-full
            border
            shadow-[0_10px_20px_rgba(15,23,42,0.18)]
            backdrop-blur-sm
            transition-all
            duration-200
            ${
              isWishlisted
                ? "size-[32px] border-[#ff8a1f] bg-slate-200 text-[#ff8618]"
                : "size-[30px] border-white/20 bg-[#171a18]/70 text-white hover:border-[#ff8618] hover:text-[#ff8618]"
            }
          `}
        >
          <Heart
            size={14}
            fill={isWishlisted ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* =====================================================
          THUMBNAILS
      ====================================================== */}

      <div className="px-3 pt-2">
        <div
          className="
            flex
            h-[40px]
            items-center
            gap-2
            overflow-hidden
          "
        >
          {productImages
            .slice(0, 5)
            .map((image, index) => {
              const isSelected =
                selectedImage === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedImage(index)
                  }
                  aria-label={`View ${product.name} image ${
                    index + 1
                  }`}
                  aria-pressed={isSelected}
                  className={`
                    relative
                    h-[38px]
                    w-[38px]
                    shrink-0
                    overflow-hidden
                    rounded-[7px]
                    bg-white
                    transition-all
                    duration-150
                    ${
                      isSelected
                        ? "border-[1.5px] border-[#f2a15a]"
                        : "border border-transparent hover:border-[#cfd3d8]"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="
                      block
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </button>
              );
            })}

          {productImages.length > 5 && (
            <span
              className="
                ml-0.5
                shrink-0
                text-[10px]
                font-semibold
                text-[#ed8b35]
              "
            >
              +{productImages.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          PRODUCT DETAILS
      ====================================================== */}

      <div className="px-3 pb-3.5 pt-2">
        {/* Category */}

        <p
          className="
            truncate
            text-[11px]
            font-medium
            uppercase
            tracking-[0.04em]
            text-slate-500
          "
        >
          {product.category}
        </p>

        {/* Product Name */}

        <h3
          className="
            mt-1
            truncate
            text-[14px]
            font-semibold
            leading-[18px]
            text-[#17191c]
          "
        >
          {product.name}
        </h3>

        {/* Rating */}

        <div
          className="
            mt-1.5
            flex
            items-center
            gap-1.5
          "
        >
          <Star
            size={11}
            fill="currentColor"
            className="text-[#f59b38]"
          />

          <span
            className="
              text-[10px]
              font-semibold
              text-[#33373b]
            "
          >
            {product.rating}
          </span>

          <span
            className="
              text-[10px]
              text-[#a7abb0]
            "
          >
            ({product.reviews})
          </span>
        </div>

        {/* =================================================
            PRICE
        ================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[15px]
                font-bold
                leading-none
                text-[#17191c]
              "
            >
              {formatPrice(product.price)}
            </span>

            {product.oldPrice && (
              <del
                className="
                  text-[10px]
                  font-normal
                  leading-none
                  text-[#a5a8ad]
                "
              >
                {formatPrice(product.oldPrice)}
              </del>
            )}
          </div>
        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            mt-3.5
            flex
            items-center
            gap-2
          "
        >
          {/* Add To Cart */}

          {quantity > 0 ? (
            <div className="flex h-[40px] min-w-0 flex-1 items-center justify-between overflow-hidden rounded-full border border-zinc-800 bg-[#171a18] px-1 shadow-[0_8px_18px_rgba(23,26,24,0.18)]">
              <button
                type="button"
                aria-label={`Decrease quantity for ${product.name}`}
                onClick={() => handleQuantityChange(-1)}
                className="flex h-[30px] w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-zinc-900 shadow-sm transition hover:bg-zinc-100"
              >
                −
              </button>

              <span className="min-w-0 flex-1 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-white">
                {quantity}
              </span>

              <button
                type="button"
                aria-label={`Increase quantity for ${product.name}`}
                onClick={() => handleQuantityChange(1)}
                className="flex h-[30px] w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-zinc-900 shadow-sm transition hover:bg-zinc-100"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={handleAddToCart}
              className="
                flex
                h-[40px]
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-full
                border
                border-zinc-800
                bg-[#171a18]
                px-3
                text-[9px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-white
                transition-all
                duration-200
                whitespace-nowrap
                hover:bg-[#090b0b]
                active:scale-[0.98]
              "
            >
              <ShoppingCart
                size={14}
                strokeWidth={1.8}
              />

              Add to cart
            </button>
          )}

          <Link
            href={`/checkout?productId=${product.id}`}
            className="inline-flex h-[40px] flex-1 items-center justify-center rounded-full bg-[#ff8a1f] px-2 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_18px_rgba(255,138,31,0.22)] transition hover:bg-[#e37b15]"
          >
            Buy
          </Link>
        </div>
      </div>
    </article>
  );
}