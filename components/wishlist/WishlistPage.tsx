"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Search,
  Share2,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

export default function WishlistPage() {
  const {
    cartCount,
    wishlistCount,
    wishlistItems,
    toggleWishlist,
    addToCart,
    searchQuery,
  } = useCart();

  const [selectedFilter, setSelectedFilter] =
    useState<
      "all" |
      "price-drop" |
      "in-stock" |
      "out-of-stock"
    >("all");

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
   * --------------------------------------------------
   * CLOSE SORT DROPDOWN
   * --------------------------------------------------
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

    if (!isSortOpen) {
      return;
    }

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
  }, [isSortOpen]);

  /*
   * --------------------------------------------------
   * WISHLIST PRODUCTS
   * --------------------------------------------------
   */
  const wishlistProducts = useMemo(() => {
    return products.filter(
      (product) =>
        wishlistItems[product.id]
    );
  }, [wishlistItems]);

  /*
   * --------------------------------------------------
   * SEARCH + FILTER + SORT
   * --------------------------------------------------
   *
   * Search NEVER navigates away from /wishlist.
   *
   * Header writes to CartContext.searchQuery.
   * This page filters its own wishlist products.
   * --------------------------------------------------
   */
  const filteredProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    const filtered =
      wishlistProducts.filter(
        (product) => {
          /*
           * SEARCH
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

            if (
              !searchableText.includes(
                query
              )
            ) {
              return false;
            }
          }

          /*
           * PRICE DROP
           */
          if (
            selectedFilter ===
            "price-drop"
          ) {
            return (
              !!product.oldPrice &&
              product.oldPrice >
                product.price
            );
          }

          /*
           * IN STOCK
           */
          if (
            selectedFilter ===
            "in-stock"
          ) {
            return (
              product.inStock !== false
            );
          }

          /*
           * OUT OF STOCK
           */
          if (
            selectedFilter ===
            "out-of-stock"
          ) {
            return (
              product.inStock === false
            );
          }

          return true;
        }
      );

    /*
     * SORT
     */
    return [...filtered].sort(
      (a, b) => {
        switch (sortBy) {
          case "Price: Low to High":
            return a.price - b.price;

          case "Price: High to Low":
            return b.price - a.price;

          case "Recently Added":
          default:
            return b.id - a.id;
        }
      }
    );
  }, [
    wishlistProducts,
    searchQuery,
    selectedFilter,
    sortBy,
  ]);

  /*
   * --------------------------------------------------
   * COUNTS
   * --------------------------------------------------
   */
  const priceDropCount =
    wishlistProducts.filter(
      (product) =>
        !!product.oldPrice &&
        product.oldPrice >
          product.price
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
   * --------------------------------------------------
   * SELECTION
   * --------------------------------------------------
   */
  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every(
      (product) =>
        selectedIds.includes(
          product.id
        )
    );

  const handleSelectChange = (
    productId: number
  ) => {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter(
            (id) =>
              id !== productId
          )
        : [
            ...current,
            productId,
          ]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) => {
      /*
       * Deselect only the products currently
       * visible after search/filtering.
       */
      if (allVisibleSelected) {
        return current.filter(
          (id) =>
            !filteredProducts.some(
              (product) =>
                product.id === id
            )
        );
      }

      /*
       * Select only currently visible products.
       */
      return Array.from(
        new Set([
          ...current,
          ...filteredProducts.map(
            (product) =>
              product.id
          ),
        ])
      );
    });
  };

  /*
   * --------------------------------------------------
   * REMOVE SELECTED
   * --------------------------------------------------
   */
  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) {
      return;
    }

    selectedIds.forEach((id) => {
      toggleWishlist(id, false);
    });

    setSelectedIds([]);
  };

  /*
   * --------------------------------------------------
   * ADD SELECTED TO CART
   * --------------------------------------------------
   */
  const handleAddSelectedToCart = () => {
    if (selectedIds.length === 0) {
      return;
    }

    selectedIds.forEach((id) => {
      addToCart(id, 1);
    });

    setSelectedIds([]);
  };

  /*
   * --------------------------------------------------
   * SHARE
   * --------------------------------------------------
   */
  const handleShareWishlist =
    async () => {
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

  const hasSearch =
    searchQuery.trim().length > 0;

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f1ee] text-zinc-900">

      {/* HEADER */}
<Header />

      <section className="mx-auto w-[calc(100%-24px)] max-w-[1720px] pb-16 sm:w-[calc(100%-28px)]">

        {/* =================================================
            HERO
            Hidden on mobile
        ================================================== */}
        <div className="hidden pt-8 sm:block lg:pt-10">

          <div className="relative overflow-hidden rounded-[28px] bg-[#171a18] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">

            <div className="relative z-10 max-w-2xl">

              <div className="mb-4 flex items-center gap-2">
                <Heart
                  size={18}
                  fill="currentColor"
                />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Your Collection
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                My Wishlist
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-6 text-white/60 sm:text-base">
                Keep your favorite products
                close and come back whenever
                you're ready.
              </p>

            </div>

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04]" />
            <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-white/[0.03]" />

          </div>

        </div>

        {/* =================================================
            MOBILE TITLE
        ================================================== */}
        <div className="pt-6 sm:hidden">

          <div className="flex items-center gap-2">

            <Heart
              size={20}
              fill="currentColor"
              className="text-zinc-900"
            />

            <h1 className="text-[28px] font-black tracking-[-0.05em]">
              My Wishlist
            </h1>

          </div>

          <p className="mt-1 text-xs text-zinc-500">
            Your saved products
          </p>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================== */}
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-3 sm:mt-8 sm:rounded-3xl sm:p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* Search status / count */}
            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="text-sm font-bold text-zinc-900">
                  {wishlistCount}
                </span>

                <span className="text-xs text-zinc-500">
                  {wishlistCount === 1
                    ? "saved item"
                    : "saved items"}
                </span>

              </div>

              {hasSearch && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">

                  <Search size={12} />

                  <span className="truncate">
                    Results for{" "}
                    <span className="font-semibold text-zinc-900">
                      "{searchQuery}"
                    </span>
                  </span>

                </div>
              )}

            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* Share */}
              <button
                type="button"
                onClick={
                  handleShareWishlist
                }
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50"
                aria-label="Share wishlist"
              >
                <Share2 size={15} />
              </button>

              {/* Sort */}
              <div
                ref={sortRef}
                className="relative flex-1 sm:flex-none"
              >

                <button
                  type="button"
                  onClick={() =>
                    setIsSortOpen(
                      (value) =>
                        !value
                    )
                  }
                  className="flex h-9 w-full items-center justify-between gap-2 rounded-full border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 sm:w-auto sm:px-4"
                >
                  <span>
                    {sortBy}
                  </span>

                  <ChevronDown
                    size={14}
                    className={
                      isSortOpen
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl">

                    {sortOptions.map(
                      (option) => (
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
                          className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
                            sortBy ===
                            option
                              ? "bg-zinc-100 font-bold text-zinc-950"
                              : "text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              FILTERS
          ================================================== */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">

            <FilterButton
              active={
                selectedFilter ===
                "all"
              }
              onClick={() =>
                setSelectedFilter(
                  "all"
                )
              }
              label="All"
              count={
                wishlistProducts.length
              }
            />

            <FilterButton
              active={
                selectedFilter ===
                "price-drop"
              }
              onClick={() =>
                setSelectedFilter(
                  "price-drop"
                )
              }
              label="Price Drop"
              count={
                priceDropCount
              }
            />

            <FilterButton
              active={
                selectedFilter ===
                "in-stock"
              }
              onClick={() =>
                setSelectedFilter(
                  "in-stock"
                )
              }
              label="In Stock"
              count={
                inStockCount
              }
            />

            <FilterButton
              active={
                selectedFilter ===
                "out-of-stock"
              }
              onClick={() =>
                setSelectedFilter(
                  "out-of-stock"
                )
              }
              label="Out of Stock"
              count={
                outOfStockCount
              }
            />

          </div>

        </div>

        {/* =================================================
            SELECTION BAR
        ================================================== */}
        {filteredProducts.length >
          0 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4">

            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-zinc-700">

              <input
                type="checkbox"
                checked={
                  allVisibleSelected
                }
                onChange={
                  handleSelectAll
                }
                className="size-4 rounded border-zinc-300 accent-zinc-900"
              />

              <span>
                Select visible
              </span>

            </label>

            {selectedIds.length >
              0 && (
              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={
                    handleAddSelectedToCart
                  }
                  className="flex h-8 items-center gap-1.5 rounded-full bg-zinc-900 px-3 text-[10px] font-bold text-white transition hover:bg-zinc-800"
                >
                  <ShoppingBag
                    size={13}
                  />

                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={
                    handleRemoveSelected
                  }
                  className="grid h-8 w-8 place-items-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove selected"
                >
                  <Trash2
                    size={13}
                  />
                </button>

              </div>
            )}

          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================== */}
        {wishlistProducts.length ===
        0 ? (

          <div className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white px-5 text-center">

            <div className="grid h-14 w-14 place-items-center rounded-full bg-zinc-100">

              <Heart
                size={23}
                className="text-zinc-400"
              />

            </div>

            <h2 className="mt-4 text-lg font-bold text-zinc-900">
              Your wishlist is empty
            </h2>

            <p className="mt-1 max-w-sm text-xs text-zinc-500 sm:text-sm">
              Save products you love and
              they'll appear here.
            </p>

            <Link
              href="/"
              className="mt-5 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800"
            >
              Start Shopping
            </Link>

          </div>

        ) : filteredProducts.length ===
          0 ? (

          <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white px-5 text-center">

            <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100">

              <Search
                size={20}
                className="text-zinc-400"
              />

            </div>

            <h2 className="mt-4 text-base font-bold text-zinc-900">
              No matching products
            </h2>

            <p className="mt-1 max-w-sm text-xs text-zinc-500 sm:text-sm">
              Nothing in your wishlist
              matches{" "}
              <span className="font-semibold text-zinc-800">
                "{searchQuery}"
              </span>
              .
            </p>

          </div>

        ) : (

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map(
              (product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={0}
                onToggleWishlist={() => {
                  toggleWishlist(product.id, false);
                }}
                onQuantityChange={() => {
                  addToCart(product.id, 1);
                }}
              />
              )
            )}

          </div>

        )}

        {/* =================================================
            PRIVATE WISHLIST
        ================================================== */}
        {wishlistProducts.length >
          0 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-3 sm:px-4">

            <div>
              <p className="text-xs font-bold text-zinc-900">
                Private wishlist
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-500 sm:text-xs">
                Only you can see your
                saved products.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsPrivate(
                  (value) =>
                    !value
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                isPrivate
                  ? "bg-zinc-900"
                  : "bg-zinc-300"
              }`}
              aria-label={
                isPrivate
                  ? "Make wishlist public"
                  : "Make wishlist private"
              }
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  isPrivate
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>
        )}

      </section>

      <Footer />
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[10px] font-bold transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {label}

      <span
        className={
          active
            ? "opacity-60"
            : "text-zinc-400"
        }
      >
        {count}
      </span>
    </button>
  );
}