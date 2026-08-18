"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ChevronDown,
  Search,
  Share2,
} from "lucide-react";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

type FilterType =
  | "all"
  | "price-drop"
  | "in-stock"
  | "out-of-stock";

export default function WishlistPage() {
const {
  wishlistItems,
  searchQuery,
} = useCart();

  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("all");

  const [sortBy, setSortBy] =
    useState("Recently Added");

  const [isSortOpen, setIsSortOpen] =
    useState(false);

  const [isPrivate, setIsPrivate] =
    useState(true);

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const sortRef =
    useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    "Recently Added",
    "Price: Low to High",
    "Price: High to Low",
  ];

  /*
   * Close sort dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node
        )
      ) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );
      };
    }
  }, [isSortOpen]);

  /*
   * Wishlist products
   */
  const wishlistProducts = useMemo(() => {
    return products.filter(
      (product) => wishlistItems[product.id]
    );
  }, [wishlistItems]);

  /*
   * Search + filter + sort
   */
  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    const filtered =
      wishlistProducts.filter((product) => {
        /*
         * Search through complete product object
         */
        if (query) {
          const searchableText = [
            product.name,
            product.category,
            product.badge ?? "",
            ...(product.keywords ?? []),
          ]
            .join(" ")
            .toLowerCase();

          if (!searchableText.includes(query)) {
            return false;
          }
        }

        /*
         * Price drop
         */
        if (
          selectedFilter === "price-drop"
        ) {
          return (
            !!product.oldPrice &&
            product.oldPrice > product.price
          );
        }

        /*
         * In stock
         */
        if (
          selectedFilter === "in-stock"
        ) {
          return product.inStock !== false;
        }

        /*
         * Out of stock
         */
        if (
          selectedFilter === "out-of-stock"
        ) {
          return product.inStock === false;
        }

        return true;
      });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High":
          return a.price - b.price;

        case "Price: High to Low":
          return b.price - a.price;

        default:
          return b.id - a.id;
      }
    });
  }, [
    wishlistProducts,
    searchQuery,
    selectedFilter,
    sortBy,
  ]);

  /*
   * Counts
   */
  const priceDropCount =
    wishlistProducts.filter(
      (product) =>
        !!product.oldPrice &&
        product.oldPrice > product.price
    ).length;

  const inStockCount =
    wishlistProducts.filter(
      (product) =>
        product.inStock !== false
    ).length;

  const outOfStockCount =
    wishlistProducts.filter(
      (product) =>
        product.inStock === false
    ).length;

  /*
   * Select all
   */
  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      selectedIds.includes(product.id)
    );

  const handleSelectChange = (
    productId: number
  ) => {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter(
            (id) => id !== productId
          )
        : [...current, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter(
          (id) =>
            !filteredProducts.some(
              (product) =>
                product.id === id
            )
        );
      }

      return Array.from(
        new Set([
          ...current,
          ...filteredProducts.map(
            (product) => product.id
          ),
        ])
      );
    });
  };

  /*
   * Share wishlist
   */
  const handleShareWishlist = async () => {
    const shareText =
      `Check out my wishlist on Sellexa: ${window.location.href}`;

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareText
        );
        return;
      }

      window.alert(
        "Wishlist link copied to clipboard."
      );
    } catch {
      window.alert(
        "Unable to copy wishlist link."
      );
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f1ee] text-zinc-900">

      <Header />

      <section className="mx-auto mt-4 w-[calc(100%-20px)] max-w-[1720px] pb-28 sm:mt-6 sm:w-[calc(100%-28px)] sm:pb-16">

        {/* =====================================================
            DESKTOP HERO
            Hidden on mobile
        ====================================================== */}
        <div className="hidden rounded-[28px] border border-zinc-200 bg-[#f6f4f1] p-6 shadow-[0_10px_32px_rgba(15,23,42,0.04)] md:block lg:p-8">

          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

            {/* Hero Content */}
            <div className="max-w-[540px]">

              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                Your wishlist
              </p>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] text-zinc-950 lg:text-[4rem]">
                Saved with love.
                <span className="block">
                  Yours, anytime.
                </span>
              </h1>

              <p className="mt-4 max-w-[420px] text-base text-zinc-600">
                All the styles you love, in one
                place.
                <span className="mt-1 block">
                  Add more. Remove anytime.
                  We&apos;ll be here.
                </span>
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
                  onClick={
                    handleShareWishlist
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  <Share2 size={15} />
                  Share Wishlist
                </button>

              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative flex flex-1 items-center justify-center xl:justify-end">

              <div className="relative w-full max-w-[560px]">

                <div className="absolute -left-8 top-12 h-12 w-12 rounded-full bg-[#f9d6de] blur-xl" />

                <div className="absolute -right-4 bottom-8 h-14 w-14 rounded-full bg-[#f4d9ff] blur-xl" />

                <div className="relative mx-auto h-[290px] w-[320px]">

                  <div className="absolute right-[34%] top-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8ca8] text-white shadow-[0_16px_34px_rgba(255,140,168,0.35)]">
                    <Heart
                      size={28}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
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

              {/* Wishlist Count */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-[22px] border border-zinc-200 bg-white/90 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">

                <div className="mb-3 flex justify-center">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fff4e7] text-[#ff8a1f]">
                    <Heart
                      size={18}
                      fill="currentColor"
                    />
                  </div>
                </div>

                <div className="text-center text-4xl font-black tracking-[-0.06em] text-zinc-950">
                  {wishlistProducts.length}
                </div>

                <p className="mt-1 text-sm text-zinc-600">
                  Items in wishlist
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE HEADER
        ====================================================== */}
        <div className="mb-4 flex items-center justify-between md:hidden">

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-[25px] font-black leading-none tracking-[-0.05em] text-zinc-950">
                Wishlist
              </h1>

              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-zinc-500 shadow-sm">
                {wishlistProducts.length}
              </span>

            </div>

            <p className="mt-1 text-[11px] text-zinc-500">
              Your saved products
            </p>
          </div>

          <button
            type="button"
            onClick={handleShareWishlist}
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm"
            aria-label="Share wishlist"
          >
            <Share2 size={16} />
          </button>

        </div>

        {/* =====================================================
            MOBILE FILTER CHIPS
        ====================================================== */}
        <div className="mb-3 md:hidden">

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">

            {[
              {
                label: "All",
                value: "all" as FilterType,
                count:
                  wishlistProducts.length,
              },
              {
                label: "Price Drop",
                value:
                  "price-drop" as FilterType,
                count: priceDropCount,
              },
              {
                label: "In Stock",
                value:
                  "in-stock" as FilterType,
                count: inStockCount,
              },
              {
                label: "Out of Stock",
                value:
                  "out-of-stock" as FilterType,
                count: outOfStockCount,
              },
            ].map((item) => {
              const active =
                selectedFilter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setSelectedFilter(
                      item.value
                    )
                  }
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold transition ${
                    active
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-600"
                  }`}
                >
                  {item.label}

                  <span
                    className={`text-[10px] ${
                      active
                        ? "text-white/70"
                        : "text-zinc-400"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}
          <aside className="hidden rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] lg:block">

            <div className="mb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                My wishlist
              </p>
            </div>

            <div className="space-y-2">

              {[
                {
                  label: "All Items",
                  value:
                    wishlistProducts.length,
                  key: "all" as FilterType,
                },
                {
                  label: "Price Drop",
                  value: priceDropCount,
                  key:
                    "price-drop" as FilterType,
                },
                {
                  label: "In Stock",
                  value: inStockCount,
                  key:
                    "in-stock" as FilterType,
                },
                {
                  label: "Out of Stock",
                  value: outOfStockCount,
                  key:
                    "out-of-stock" as FilterType,
                },
              ].map((item) => {

                const isActive =
                  selectedFilter === item.key;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setSelectedFilter(
                        item.key
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "bg-[#fdf2ed] text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >

                    <span className="flex items-center gap-3">

                      <span
                        className={`h-4 w-4 rounded-full border ${
                          isActive
                            ? "border-[#171a18] bg-[#171a18]"
                            : "border-zinc-300"
                        }`}
                      />

                      <span className="font-medium">
                        {item.label}
                      </span>

                    </span>

                    <span className="text-xs font-semibold text-zinc-500">
                      {item.value}
                    </span>

                  </button>
                );
              })}

            </div>

            {/* Privacy */}
            <div className="mt-8 border-t border-zinc-200 pt-5">

              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">
                Wishlist privacy
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsPrivate(
                    (value) => !value
                  )
                }
                className="mt-4 flex w-full items-center justify-between gap-3 text-sm text-zinc-700"
              >

                <span>
                  Private wishlist
                </span>

                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    isPrivate
                      ? "bg-zinc-900"
                      : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute h-4 w-4 rounded-full bg-white transition ${
                      isPrivate
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </span>

              </button>

            </div>
          </aside>

          {/* =================================================
              PRODUCTS AREA
          ================================================= */}
          <div className="min-w-0 rounded-[18px] border border-zinc-200 bg-white p-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.035)] sm:rounded-[24px] sm:p-4">

            {/* Top Controls */}
            <div className="mb-3 flex items-center justify-between gap-2 sm:mb-5">

              {/* Select All */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-zinc-600 sm:gap-3 sm:text-sm"
              >

                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                    allVisibleSelected
                      ? "border-zinc-900 bg-zinc-900"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {allVisibleSelected && (
                    <span className="h-1.5 w-1.5 rounded-sm bg-white" />
                  )}
                </span>

                <span className="truncate">
                  Select All
                </span>

                <span className="text-zinc-400">
                  ({filteredProducts.length})
                </span>

              </button>

              {/* Sort */}
              <div
                ref={sortRef}
                className="relative shrink-0"
              >

                <button
                  type="button"
                  aria-expanded={isSortOpen}
                  onClick={() =>
                    setIsSortOpen(
                      (open) => !open
                    )
                  }
                  className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 text-[10px] font-semibold text-zinc-600 shadow-sm sm:h-10 sm:gap-3 sm:rounded-xl sm:px-3.5 sm:text-sm"
                >
                  <span className="hidden sm:inline">
                    Sort:
                  </span>

                  <span className="max-w-[100px] truncate">
                    {sortBy}
                  </span>

                  <ChevronDown
                    size={13}
                    className={`text-zinc-400 transition-transform ${
                      isSortOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[190px] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">

                    {sortOptions.map(
                      (option) => {
                        const isSelected =
                          option === sortBy;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSortBy(
                                option
                              );
                              setIsSortOpen(
                                false
                              );
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                              isSelected
                                ? "bg-zinc-950 text-white"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <span>
                              {option}
                            </span>

                            {isSelected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </button>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* Search Result */}
            {searchQuery.trim() && (
              <div className="mb-3 flex min-w-0 items-center gap-1.5 rounded-xl bg-zinc-50 px-3 py-2 text-[10px] text-zinc-500 sm:mb-5 sm:px-4 sm:py-3 sm:text-sm">

                <Search
                  size={13}
                  className="shrink-0"
                />

                <span className="truncate">
                  Results for{" "}
                  <strong className="text-zinc-900">
                    &quot;{searchQuery}&quot;
                  </strong>
                </span>

              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[16px] border border-dashed border-zinc-300 bg-zinc-50 px-5 text-center sm:min-h-[300px] sm:rounded-[20px] sm:px-10">

                <div className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm sm:h-14 sm:w-14">
                  <Search
                    size={18}
                    className="text-zinc-400 sm:size-[22px]"
                  />
                </div>

                <p className="mt-3 text-sm font-semibold text-zinc-800 sm:text-base">
                  {searchQuery.trim()
                    ? "No matching products"
                    : "No products found"}
                </p>

                <p className="mt-1 max-w-[280px] text-[11px] leading-relaxed text-zinc-500 sm:text-sm">
                  {searchQuery.trim()
                    ? `Nothing in your wishlist matches "${searchQuery}".`
                    : "No products match this selection."}
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">

                {filteredProducts.map(
                  (product) => {

                    const isSelected =
                      selectedIds.includes(
                        product.id
                      );

                    return (
                      <div
                        key={product.id}
                        className="relative min-w-0"
                      >

                        {/* Selection */}
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectChange(
                              product.id
                            )
                          }
                          className={`absolute left-2 top-2 z-20 grid h-6 w-6 place-items-center rounded-md border shadow-sm transition sm:left-3 sm:top-3 sm:h-7 sm:w-7 ${
                            isSelected
                              ? "border-zinc-900 bg-zinc-900"
                              : "border-white bg-white/90"
                          }`}
                          aria-label={`Select ${product.name}`}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-sm bg-white" />
                          )}
                        </button>

                        <ProductCard
                          product={product}
                          showBadge={false}
                        />

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            MOBILE PRIVACY
        ====================================================== */}
        <div className="mt-3 flex items-center justify-between rounded-[16px] border border-zinc-200 bg-white px-3 py-2.5 lg:hidden">

          <div>
            <p className="text-[11px] font-semibold text-zinc-800">
              Private wishlist
            </p>

            <p className="text-[9px] text-zinc-400">
              Only you can see this
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsPrivate(
                (value) => !value
              )
            }
            className={`relative h-6 w-11 rounded-full transition ${
              isPrivate
                ? "bg-zinc-900"
                : "bg-zinc-200"
            }`}
            aria-label="Toggle wishlist privacy"
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                isPrivate
                  ? "right-1"
                  : "left-1"
              }`}
            />
          </button>

        </div>

        {/* =====================================================
            TRUST FEATURES
        ====================================================== */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-zinc-200 pt-5 sm:mt-8 sm:grid-cols-2 sm:gap-4 sm:pt-8 xl:grid-cols-4">

          {[
            {
              title: "Secure & Safe",
              subtitle:
                "Your data is protected",
            },
            {
              title: "Price Match",
              subtitle:
                "Get the best deals",
            },
            {
              title: "Fast Delivery",
              subtitle:
                "Quick & reliable shipping",
            },
            {
              title: "Easy Returns",
              subtitle:
                "Hassle-free returns",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex min-w-0 items-center gap-2 rounded-[14px] border border-zinc-200 bg-white p-2.5 sm:gap-3 sm:rounded-[20px] sm:p-4"
            >

              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f5f6f3] text-zinc-700 sm:h-10 sm:w-10">

                <span className="text-sm sm:text-lg">
                  ✓
                </span>

              </div>

              <div className="min-w-0">

                <p className="truncate text-[10px] font-bold text-zinc-900 sm:text-base">
                  {item.title}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-zinc-500 sm:text-sm">
                  {item.subtitle}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      <Footer />

    </main>
  );
}