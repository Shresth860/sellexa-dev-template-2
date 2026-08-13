"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/product";

type ProductInfoProps = {
  product: Product;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, cartItems, toggleWishlist, updateCartQuantity } = useCart();
  const cartQuantity = cartItems[product.id] ?? 0;
  const [quantity, setQuantity] = useState(cartQuantity > 0 ? cartQuantity : 1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(cartQuantity > 0);

  useEffect(() => {
    if (cartQuantity > 0) {
      setIsAddedToCart(true);
      setQuantity(cartQuantity);
    } else {
      setIsAddedToCart(false);
      setQuantity((current) => current || 1);
    }
  }, [cartQuantity]);

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  const highlights = [
    "Premium build with durable materials",
    "Designed for everyday comfort and performance",
    "Fast shipping and easy returns across India",
  ];

  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
        <span>{product.category}</span>
        {discount && <span className="rounded-full bg-[#fff1e5] px-2 py-1 text-[#ff8a1f]">{discount}% OFF</span>}
      </div>

      <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-zinc-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-4 flex items-center gap-3 text-sm text-zinc-600">
        <div className="flex items-center gap-1.5 rounded-full bg-[#fff8ef] px-2.5 py-1.5 text-[#f59b38]">
          <Star size={14} fill="currentColor" />
          <span className="font-bold text-zinc-900">{product.rating}</span>
        </div>

        <span>{product.reviews} reviews</span>
      </div>

      <div className="mt-6 flex items-center flex-wrap gap-3">
        <span className="text-3xl font-black tracking-[-0.05em] text-zinc-950">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice && (
          <del className="text-lg font-medium text-zinc-400">
            {formatPrice(product.oldPrice)}
          </del>
        )}
      </div>

      <p className="mt-5 text-base leading-7 text-zinc-600">
        Built for everyday use with a premium finish, strong performance, and a smooth shopping experience that matches modern lifestyles.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-[54px] items-center overflow-hidden rounded-[16px] border border-zinc-200 bg-zinc-50">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => {
              const nextValue = Math.max(1, quantity - 1);
              setQuantity(nextValue);
              if (cartQuantity > 0) {
                updateCartQuantity(product.id, nextValue);
              }
            }}
            className="flex h-full w-12 items-center justify-center bg-zinc-900 text-xl font-semibold text-white"
          >
            −
          </button>

          <span className="min-w-[64px] text-center text-lg font-extrabold text-zinc-900">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => {
              const nextValue = quantity + 1;
              setQuantity(nextValue);
              if (cartQuantity > 0) {
                updateCartQuantity(product.id, nextValue);
              }
            }}
            className="flex h-full w-12 items-center justify-center bg-zinc-900 text-xl font-semibold text-white"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextTotal = cartQuantity > 0 ? quantity : cartQuantity + quantity;
            if (cartQuantity > 0) {
              updateCartQuantity(product.id, nextTotal);
            } else {
              addToCart(product.id, quantity);
            }
            setIsAddedToCart(true);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition ${
            isAddedToCart ? "bg-[#ff8a1f] hover:bg-[#e37b15]" : "bg-[#171a18] hover:bg-[#090b0b]"
          }`}
        >
          <ShoppingCart size={18} />
          {cartQuantity > 0 ? `Added (${cartQuantity})` : isAddedToCart ? `Added (${quantity})` : "Add to cart"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const nextValue = !isWishlisted;
            setIsWishlisted(nextValue);
            toggleWishlist(product.id, nextValue);
          }}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
            isWishlisted
              ? "border-[#ff8a1f] bg-[#fff7ef] text-[#ff8a1f]"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          {isWishlisted ? "Saved" : "Save for later"}
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 space-y-3 rounded-[22px] border border-zinc-200 bg-[#f9faf7] p-4">
        <div className="flex items-center gap-3 text-sm text-zinc-700">
          <Truck className="text-[#ff8a1f]" size={18} />
          <span>Free delivery on orders above ₹799</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-700">
          <ShieldCheck className="text-[#ff8a1f]" size={18} />
          <span>Secure checkout and 30-day easy returns</span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-extrabold tracking-[-0.04em] text-zinc-900">
          Why shoppers like it
        </h2>

        <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
          {highlights.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff8a1f]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
