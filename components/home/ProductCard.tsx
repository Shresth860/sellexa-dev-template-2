"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import type { Product } from "@/data/product";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
  quantity?: number;
  onQuantityChange?: (nextQuantity: number) => void;
  onToggleWishlist?: (isActive: boolean) => void;
  showBadge?: boolean;
};

export default function ProductCard({
  product,
  quantity: initialQuantity = 0,
  onQuantityChange,
  onToggleWishlist,
  showBadge = true,
}: ProductCardProps) {
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

  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(Boolean(wishlistItems[product.id]));
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setIsWishlisted(Boolean(wishlistItems[product.id]));
  }, [product.id, wishlistItems]);

  const activeImage =
    productImages[selectedImage] || product.image;

  const handleWishlistToggle = () => {
    const nextValue = !isWishlisted;
    setIsWishlisted(nextValue);
    toggleWishlist(product.id, nextValue);
    onToggleWishlist?.(nextValue);
  };

  const handleAddToCart = () => {
    const nextValue = quantity + 1;
    setQuantity(nextValue);
    onQuantityChange?.(nextValue);
    addToCart(product.id, 1);
  };

  const handleQuantityChange = (delta: number) => {
    const nextValue = Math.max(0, quantity + delta);
    const previousValue = quantity;

    setQuantity(nextValue);
    onQuantityChange?.(nextValue);

    if (delta > 0 && previousValue < nextValue) {
      addToCart(product.id, delta);
    }

    if (delta < 0 && previousValue > nextValue) {
      addToCart(product.id, delta);
    }
  };

  return (
    <article
      id={`product-${product.id}`}
      className="
        group
        w-full
        min-w-0
        overflow-hidden
        rounded-[20px]
        border
        border-[#dfe3e8]
        bg-white
        transition-all
        duration-200
        sm:hover:-translate-y-0.5
        sm:hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]
      "
    >
      {/* =====================================================
          MAIN PRODUCT IMAGE
      ====================================================== */}

      <div
        className="
          relative
          h-[152px]
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
              hover:scale-[1.03]
            "
          />
        </Link>

        {/* =================================================
            DISCOUNT / BADGE
        ================================================== */}

        {showBadge && (product.badge || discount) && (
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

      <div className="px-2 pt-2 sm:px-2.5">
        <div
          className="
            flex
            h-[30px]
            items-center
            gap-1.5
            overflow-x-auto
            overflow-y-hidden
            scrollbar-none
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            sm:h-[32px]
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
                    h-[30px]
                    w-[30px]
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

      <div className="px-2 pb-2.5 pt-2 sm:px-2.5 sm:pb-3">
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
            line-clamp-2
            min-h-[32px]
            text-[11px]
            font-semibold
            leading-[15px]
            sm:text-[12px]
            sm:leading-[16px]
            text-[#17191c]
          "
        >
          {product.name}
        </h3>

        {/* Rating */}

        <div
          className="
            mt-1
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
            mt-2.5
            flex
            items-center
            justify-between
            sm:mt-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <span
              className="
                text-[13px]
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
            mt-2.5
            flex
            w-full
            items-center
            gap-1.5
            sm:mt-3
            sm:gap-2
          "
        >
          {/* Add To Cart */}

          {quantity > 0 ? (
          <div className="flex h-[34px] min-w-0 flex-1 items-center justify-between overflow-hidden rounded-full border border-zinc-800 bg-[#171a18] px-1 shadow-[0_6px_14px_rgba(23,26,24,0.16)] sm:h-[40px]">
            <button
              type="button"
              aria-label={`Decrease quantity for ${product.name}`}
              onClick={() => handleQuantityChange(-1)}
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white text-base font-bold leading-none text-zinc-900 shadow-sm transition hover:bg-zinc-100 active:scale-95 sm:h-[30px] sm:w-[30px]"
            >
              −
            </button>

            <span className="min-w-0 flex-1 px-1 text-center text-xs font-extrabold text-white sm:text-sm">
              {quantity}
            </span>

            <button
              type="button"
              aria-label={`Increase quantity for ${product.name}`}
              onClick={() => handleQuantityChange(1)}
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white text-base font-bold leading-none text-zinc-900 shadow-sm transition hover:bg-zinc-100 active:scale-95 sm:h-[30px] sm:w-[30px]"
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
                h-[42px]
                min-w-0
                flex-[1.45]
                items-center
                justify-center
                gap-1.5
                rounded-full
                border
                border-zinc-800
                bg-[#171a18]
                px-2.5
                text-[9px]
                font-bold
                sm:h-[40px]
                sm:flex-1
                sm:px-3
                sm:text-[9px]
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
                size={15}
                strokeWidth={1.9}
              />

              Add to cart
            </button>
          )}

          <Link
            href={`/checkout?productId=${product.id}`}
            className="inline-flex h-[42px] min-w-0 flex-[0.75] items-center justify-center rounded-full bg-[#ff8a1f] px-2 text-[9px] font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_16px_rgba(255,138,31,0.18)] sm:h-[40px] sm:flex-1 sm:px-2 sm:text-[9px] shadow-[0_10px_18px_rgba(255,138,31,0.22)] transition hover:bg-[#e37b15]"
          >
            Buy
          </Link>
        </div>
      </div>
    </article>
  );
}