"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useCart } from "@/context/CartContext";
import { products as allProducts, type Product } from "@/data/product";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";

type ProductDetailPageProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetailPage({
  product,
  relatedProducts,
}: ProductDetailPageProps) {
  const { cartCount, wishlistCount } = useCart();

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-zinc-900">
      <Header
        query=""
        setQuery={() => {}}
        products={allProducts}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        showBackHome
        backHomeHref="/"
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px]">
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link href="/#shop" className="transition hover:text-zinc-900">Shop</Link>
          <span>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="self-start xl:sticky xl:top-24">
            <ProductGallery product={product} />
          </div>
          <div className="self-start">
            <ProductInfo product={product} />
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Customer reviews</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-zinc-950">Loved by shoppers</h2>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-[#fff8ef] px-4 py-2 text-[#f59b38]">
              <span className="flex items-center gap-1.5 text-lg font-bold text-zinc-900">
                <span>{product.rating}</span>
                <span className="text-[#f59b38]">★</span>
              </span>
              <span className="text-sm font-medium text-zinc-700">{product.reviews} verified reviews</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href={`/product/${product.id}/reviews`}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              Show all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Aarav S.",
                rating: 5,
                text: "Great quality and finish. The product feels premium and looks exactly as shown.",
                badge: "Verified Purchase",
              },
              {
                name: "Meher P.",
                rating: 4,
                text: "Shipping was quick and the packaging was excellent. Very happy with the value.",
                badge: "Repeat Buyer",
              },
              {
                name: "Riya T.",
                rating: 5,
                text: "The design is stylish, the feel is high-end, and it fits my routine perfectly.",
                badge: "Top Reviewer",
              },
            ].map((review) => (
              <article key={review.name} className="rounded-[22px] border border-zinc-200 bg-[#f9faf7] p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-900">{review.name}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{review.badge}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[#f59b38]">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <span key={`${review.name}-${index}`}>★</span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-600">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />

      <Footer />
    </main>
  );
}
