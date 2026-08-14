"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

export default function ProductReviewsPage() {
  const params = useParams<{ id: string }>();
  const { cartCount, wishlistCount } = useCart();
  const productId = Number(params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const reviews = [
    {
      name: "Aarav S.",
      rating: 5,
      badge: "Verified Purchase",
      text: "Great quality and finish. The product feels premium and looks exactly as shown.",
    },
    {
      name: "Meher P.",
      rating: 4,
      badge: "Repeat Buyer",
      text: "Shipping was quick and the packaging was excellent. Very happy with the value.",
    },
    {
      name: "Riya T.",
      rating: 5,
      badge: "Top Reviewer",
      text: "The design is stylish, the feel is high-end, and it fits my routine perfectly.",
    },
    {
      name: "Kabir H.",
      rating: 5,
      badge: "Verified Purchase",
      text: "Exceeded my expectation in both performance and finish. Highly recommended.",
    },
    {
      name: "Naina K.",
      rating: 4,
      badge: "Happy Shopper",
      text: "Looks premium, works smoothly, and the delivery was faster than expected.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-zinc-900">
      <Header
        query=""
        setQuery={() => {}}
        products={products}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        showBackHome
        backHomeHref={`/product/${product.id}`}
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1200px] pb-16">
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link href={`/product/${product.id}`} className="transition hover:text-zinc-900">{product.name}</Link>
          <span>/</span>
          <span className="text-zinc-900">Reviews</span>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Reviews</p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-zinc-950">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3 rounded-full bg-[#fff8ef] px-4 py-2 text-[#f59b38]">
              <span className="flex items-center gap-1 text-lg font-bold text-zinc-900">
                {product.rating}
                <span className="text-[#f59b38]">★</span>
              </span>
              <span className="text-sm font-medium text-zinc-700">{product.reviews} reviews</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {reviews.map((review) => (
              <article key={`${review.name}-${review.badge}`} className="rounded-[22px] border border-zinc-200 bg-[#f9faf7] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                <p className="mt-4 text-sm leading-7 text-zinc-600">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
