"use client";

import Link from "next/link";
import { useMemo, useRef, useEffect, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

export default function WishlistPage() {
  const { cartCount, wishlistCount, wishlistItems, toggleWishlist, addToCart } = useCart();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "price-drop" | "in-stock" | "out-of-stock">("all");
  const [sortBy, setSortBy] = useState("Recently Added");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const sortOptions = ["Recently Added", "Price: Low to High", "Price: High to Low"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSortOpen]);

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistItems[product.id]),
    [wishlistItems]
  );

  const filteredProducts = useMemo(() => {
    const nextItems = [...wishlistProducts];

    const filtered = nextItems.filter((product) => {
      if (selectedFilter === "price-drop") {
        return !!product.oldPrice && product.oldPrice > product.price;
      }

      if (selectedFilter === "in-stock") {
        return product.inStock !== false;
      }

      if (selectedFilter === "out-of-stock") {
        return product.inStock === false;
      }

      return true;
    });

    switch (sortBy) {
      case "Price: Low to High":
        return filtered.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered.sort((a, b) => b.id - a.id);
    }
  }, [sortBy, selectedFilter, wishlistProducts]);

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIds.includes(product.id));

  const handleSelectChange = (productId: number) => {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !filteredProducts.some((product) => product.id === id));
      }

      return Array.from(new Set([...current, ...filteredProducts.map((product) => product.id)]));
    });
  };

  const handleShareWishlist = async () => {
    const shareText = `Check out my wishlist on Sellexa: ${window.location.href}`;

    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(shareText);
      return;
    }

    window.alert("Wishlist link copied to clipboard.");
  };

  const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen bg-[#f3f1ee] text-zinc-900">
      <Header
        query=""
        setQuery={() => {}}
        products={products}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        showBackHome
        backHomeHref="/"
        hideWishlist
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px] pb-16">
        <div className="rounded-[28px] border border-zinc-200 bg-[#f6f4f1] p-6 shadow-[0_10px_32px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-[540px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                Your wishlist
              </p>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] text-zinc-950 sm:text-5xl lg:text-[4rem]">
                Saved with love.
                <span className="block text-zinc-950">Yours, anytime.</span>
              </h1>

              <p className="mt-4 max-w-[420px] text-base text-zinc-600">
                All the styles you love, in one place.
                <span className="mt-1 block">Add more. Remove anytime. We&apos;ll be here.</span>
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#171a18] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0f1110]"
                >
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={handleShareWishlist}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  Share Wishlist
                </button>
              </div>
            </div>

            <div className="relative flex flex-1 items-center justify-center xl:justify-end">
              <div className="relative w-full max-w-[560px]">
                <div className="absolute -left-8 top-12 h-12 w-12 rounded-full bg-[#f9d6de] blur-xl" />
                <div className="absolute -right-4 bottom-8 h-14 w-14 rounded-full bg-[#f4d9ff] blur-xl" />

                <div className="relative mx-auto h-[290px] w-[320px] sm:h-[330px] sm:w-[360px]">
                  <div className="absolute right-[34%] top-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8ca8] text-white shadow-[0_16px_34px_rgba(255,140,168,0.35)]">
                    <Heart size={28} fill="currentColor" strokeWidth={1.5} />
                  </div>

                  <div className="absolute left-[18%] top-[24%] h-[18px] w-[18px] rotate-45 rounded-md bg-[#e2d3f8] opacity-80" />
                  <div className="absolute left-[24%] top-[30%] h-[18px] w-[18px] rotate-45 rounded-md bg-[#f7d89a] opacity-80" />
                  <div className="absolute right-[20%] top-[34%] h-[8px] w-[8px] rounded-full bg-[#e3d2b4]" />
                  <div className="absolute right-[28%] bottom-[12%] h-[12px] w-[12px] rounded-full bg-[#e5d5b6]" />

                  <div className="absolute bottom-0 right-[16%] h-[160px] w-[180px] rounded-[22px] bg-[linear-gradient(180deg,#f9b863_0%,#f3a94f_100%)] shadow-[0_24px_50px_rgba(243,169,79,0.35)]">
                    <div className="absolute inset-x-5 top-2 h-4 rounded-full border border-white/60 border-b-0" />
                    <div className="absolute left-5 top-10 h-8 w-[70%] rounded-full border border-white/40 bg-white/10" />
                    <div className="absolute left-8 top-20 h-12 w-[70%] rounded-full border border-white/60 bg-[#f9b863]" />
                    <div className="absolute left-10 top-8 h-16 w-12 rounded-full border border-white/40 bg-white/10" />
                  </div>

                  <div className="absolute bottom-12 right-0 h-20 w-20 rounded-[18px] bg-[#f4f4f2] shadow-[0_12px_24px_rgba(15,23,42,0.06)]" />
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-[22px] border border-zinc-200 bg-white/90 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5">
                <div className="mb-3 flex items-center justify-center">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff4e7] text-[#ff8a1f]">
                    <Heart size={18} fill="currentColor" />
                  </div>
                </div>
                <div className="text-center text-4xl font-black tracking-[-0.06em] text-zinc-950">
                  {wishlistProducts.length}
                </div>
                <p className="mt-1 text-sm text-zinc-600">Items in wishlist</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                My wishlist
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "All Items",
                  value: wishlistProducts.length,
                  key: "all",
                },
                {
                  label: "Price Drop",
                  value: wishlistProducts.filter((product) => product.oldPrice && product.oldPrice > product.price).length,
                  key: "price-drop",
                },
                {
                  label: "In Stock",
                  value: wishlistProducts.filter((product) => product.inStock !== false).length,
                  key: "in-stock",
                },
                {
                  label: "Out of Stock",
                  value: wishlistProducts.filter((product) => product.inStock === false).length,
                  key: "out-of-stock",
                },
              ].map((item) => {
                const isActive = selectedFilter === item.key;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedFilter(item.key as typeof selectedFilter)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "bg-[#fdf2ed] text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`h-4 w-4 rounded-full border ${isActive ? "border-[#171a18] bg-[#171a18]" : "border-zinc-300"}`} />
                      <span className="font-medium">{item.label}</span>
                    </span>
                    <span className="text-xs font-semibold text-zinc-500">{item.value}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                Wishlist privacy
              </p>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsPrivate((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 text-sm text-zinc-700"
                >
                  <span className="flex items-center gap-2">
                    <span className="grid h-4 w-4 place-items-center rounded-sm border border-zinc-300 bg-white">
                      <span className={`h-2 w-2 rounded-sm ${isPrivate ? "bg-zinc-900" : "bg-transparent"}`} />
                    </span>
                    Private wishlist
                  </span>
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full ${isPrivate ? "bg-zinc-900" : "bg-zinc-200"}`}>
                    <span className={`absolute h-4 w-4 rounded-full bg-white transition ${isPrivate ? "right-1" : "left-1"}`} />
                  </span>
                </button>

                <div className="flex items-center justify-between gap-3 text-sm text-zinc-700">
                  <span>Only you can see this wishlist</span>
                  <span className={`relative inline-flex h-6 w-11 items-center rounded-full ${isPrivate ? "bg-zinc-900" : "bg-zinc-200"}`}>
                    <span className={`absolute h-4 w-4 rounded-full bg-white transition ${isPrivate ? "right-1" : "left-1"}`} />
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center gap-3 text-sm font-medium text-zinc-700"
              >
                <span className={`grid h-4 w-4 place-items-center rounded border ${allVisibleSelected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white"}`}>
                  {allVisibleSelected && <span className="h-2 w-2 rounded-sm bg-white" />}
                </span>
                Select All ({filteredProducts.length})
              </button>

              <div className="relative z-20 flex items-center gap-3 text-sm text-zinc-600">
                <span>Sort by:</span>

                <div ref={sortRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                    onClick={() => setIsSortOpen((open) => !open)}
                    className="flex h-11 min-w-[190px] items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/90 px-3.5 pr-3 text-sm font-medium text-zinc-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] outline-none transition duration-200 hover:border-zinc-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)] focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                  >
                    <span className="truncate">{sortBy}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[220px] overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                      {sortOptions.map((option) => {
                        const isSelected = option === sortBy;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSortBy(option);
                              setIsSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                              isSelected
                                ? "bg-zinc-950 text-white shadow-sm"
                                : "bg-transparent text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <span>{option}</span>
                            {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center text-zinc-600">
                No products match this selection.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <div key={product.id} className="relative">
                      <button
                        type="button"
                        onClick={() => handleSelectChange(product.id)}
                        className={`absolute left-3 top-3 z-20 grid h-6 w-6 place-items-center rounded border transition ${
                          isSelected ? "border-zinc-900 bg-zinc-900 text-white" : "border-white/80 bg-white/80 text-zinc-700"
                        }`}
                        aria-label={`Select ${product.name}`}
                      >
                        {isSelected && <span className="h-2 w-2 rounded-sm bg-white" />}
                      </button>

                      <ProductCard product={product} showBadge={false} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Secure & Safe", subtitle: "Your data is protected" },
            { title: "Price Match", subtitle: "Get the best deals" },
            { title: "Fast Delivery", subtitle: "Quick & reliable shipping" },
            { title: "Easy Returns", subtitle: "Hassle-free returns" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-[20px] border border-zinc-200 bg-white p-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f5f6f3] text-zinc-700">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="text-base font-bold text-zinc-900">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
