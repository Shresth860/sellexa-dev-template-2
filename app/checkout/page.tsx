"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { products } from "@/data/product";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId") ?? "0");

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === productId) ?? products[0],
    [productId]
  );

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen bg-[#f5f6f3] px-4 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-zinc-950">
              Review your order
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            Continue shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-center gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  {selectedProduct.category}
                </p>
                <h2 className="mt-2 text-xl font-extrabold tracking-[-0.04em] text-zinc-950">
                  {selectedProduct.name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-black text-zinc-950">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.oldPrice ? (
                    <del className="text-sm text-zinc-400">
                      {formatPrice(selectedProduct.oldPrice)}
                    </del>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[20px] border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  {formatPrice(selectedProduct.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-lg font-black text-zinc-950">
                  {formatPrice(selectedProduct.price)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-zinc-200 bg-[#fffaf4] p-5">
            <h3 className="text-lg font-extrabold tracking-[-0.04em] text-zinc-950">
              Delivery details
            </h3>

            <div className="mt-5 space-y-4 text-sm text-zinc-700">
              <div>
                <label className="mb-1.5 block font-semibold text-zinc-800">Full name</label>
                <input
                  type="text"
                  defaultValue="Aman Sharma"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 outline-none focus:border-[#ff8a1f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-semibold text-zinc-800">Email</label>
                <input
                  type="email"
                  defaultValue="aman@example.com"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 outline-none focus:border-[#ff8a1f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-semibold text-zinc-800">Address</label>
                <textarea
                  defaultValue="12 Market Road, New Delhi, India"
                  rows={4}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 outline-none focus:border-[#ff8a1f]"
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center rounded-[16px] bg-[#171a18] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#090b0b]"
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
