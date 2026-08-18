"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Search,
  Trash2,
} from "lucide-react";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartTrustBar from "./CartTrustBar";
import EmptyCartState from "./EmptyCartState";

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    wishlistCount,
    searchQuery,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
  } = useCart();

  /*
   * --------------------------------------------------
   * CART LINE ITEMS
   * --------------------------------------------------
   */
  const lineItems = useMemo(() => {
    return Object.entries(cartItems)
      .map(([productId, quantity]) => ({
        product: products.find(
          (item) => item.id === Number(productId)
        ),
        quantity,
      }))
      .filter(
        (
          item
        ): item is {
          product: (typeof products)[number];
          quantity: number;
        } => Boolean(item.product)
      );
  }, [cartItems]);

  /*
   * --------------------------------------------------
   * SEARCH CART ITEMS
   * --------------------------------------------------
   *
   * Search NEVER changes the URL.
   *
   * Header updates searchQuery through CartContext.
   * This page simply filters its own cart items.
   * --------------------------------------------------
   */
  const filteredLineItems = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return lineItems;
    }

    return lineItems.filter(
      ({ product }) => {
        const searchableText = [
          product.name,
          product.category,
          product.badge ?? "",
          ...(product.keywords ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          query
        );
      }
    );
  }, [
    lineItems,
    searchQuery,
  ]);

  /*
   * --------------------------------------------------
   * SELECTED ITEMS
   * --------------------------------------------------
   */
  const [selectedIds, setSelectedIds] =
    useState<Set<number>>(new Set());

  const knownIdsRef =
    useRef<Set<number>>(new Set());

  /*
   * Keep newly added cart products selected.
   */
  useEffect(() => {
    const currentIds = new Set(
      lineItems.map(
        (item) => item.product.id
      )
    );

    setSelectedIds((prev) => {
      const next = new Set<number>();

      currentIds.forEach((id) => {
        if (
          prev.has(id) ||
          !knownIdsRef.current.has(id)
        ) {
          next.add(id);
        }
      });

      return next;
    });

    knownIdsRef.current =
      currentIds;
  }, [lineItems]);

  /*
   * Selected items from the COMPLETE cart.
   */
  const selectedLineItems =
    useMemo(
      () =>
        lineItems.filter((item) =>
          selectedIds.has(
            item.product.id
          )
        ),
      [
        lineItems,
        selectedIds,
      ]
    );

  const selectedItemCount =
    useMemo(
      () =>
        selectedLineItems.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),
      [selectedLineItems]
    );

  const selectedProductIds =
    useMemo(
      () =>
        selectedLineItems.map(
          (item) =>
            item.product.id
        ),
      [selectedLineItems]
    );

  /*
   * --------------------------------------------------
   * SELECT ALL
   * --------------------------------------------------
   *
   * Select All works only against the currently
   * visible/filtered products.
   * --------------------------------------------------
   */
  const allSelected =
    filteredLineItems.length > 0 &&
    filteredLineItems.every(
      ({ product }) =>
        selectedIds.has(product.id)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      /*
       * Remove only the currently visible
       * filtered products from selection.
       */
      setSelectedIds((current) => {
        const next = new Set(
          current
        );

        filteredLineItems.forEach(
          ({ product }) => {
            next.delete(product.id);
          }
        );

        return next;
      });

      return;
    }

    /*
     * Add all currently visible products.
     */
    setSelectedIds((current) => {
      const next = new Set(
        current
      );

      filteredLineItems.forEach(
        ({ product }) => {
          next.add(product.id);
        }
      );

      return next;
    });
  };

  /*
   * Select / deselect one product.
   */
  const toggleSelectOne = (
    productId: number
  ) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  /*
   * --------------------------------------------------
   * CLEAR CART
   * --------------------------------------------------
   */
  const handleClearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "This will remove all items from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:
        "#0f172a",
      cancelButtonColor:
        "#64748b",
      confirmButtonText:
        "Yes, clear it",
      cancelButtonText:
        "Cancel",

      customClass: {
        popup:
          "rounded-3xl font-sans",

        title:
          "text-lg font-bold text-zinc-900",

        confirmButton:
          "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",

        cancelButton:
          "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-2xs",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      }
    });
  };

  /*
   * --------------------------------------------------
   * MOVE ALL TO WISHLIST
   * --------------------------------------------------
   */
  const handleMoveAllToWishlist =
    () => {
      if (lineItems.length === 0) {
        return;
      }

      Swal.fire({
        title:
          "Move all to wishlist?",

        text:
          "All items will be moved from your cart to your wishlist.",

        icon: "question",

        showCancelButton: true,

        confirmButtonColor:
          "#0f172a",

        cancelButtonColor:
          "#64748b",

        confirmButtonText:
          "Yes, move them",

        cancelButtonText:
          "Cancel",

        customClass: {
          popup:
            "rounded-3xl font-sans",

          title:
            "text-lg font-bold text-zinc-900",

          confirmButton:
            "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",

          cancelButton:
            "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-2xs",
        },
      }).then((result) => {
        if (!result.isConfirmed) {
          return;
        }

        lineItems.forEach(
          ({ product }) => {
            toggleWishlist(
              product.id,
              true
            );

            removeFromCart(
              product.id
            );
          }
        );

        Swal.fire({
          title:
            "Moved to wishlist",

          icon: "success",

          timer: 1500,

          showConfirmButton: false,

          customClass: {
            popup:
              "rounded-3xl font-sans",

            title:
              "text-lg font-bold text-zinc-900",
          },
        });
      });
    };

  const hasSearch =
    searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-zinc-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header
        products={products}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        showBackHome
        backHomeHref="/"
        hideCart
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto mt-6 w-[calc(100%-24px)] max-w-[1720px] pb-16 sm:mt-8 sm:w-[calc(100%-28px)]">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 sm:text-sm">

          <Link
            href="/"
            className="transition hover:text-zinc-900"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <span className="text-zinc-900">
            Cart
          </span>

        </div>

        {/* Page heading */}
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex flex-wrap items-baseline gap-2">

              <h1 className="text-[30px] font-black leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-[40px] lg:text-[44px]">
                My Cart
              </h1>

              {cartCount > 0 && (
                <span className="text-xs font-medium text-zinc-500 sm:text-sm">
                  ({cartCount}{" "}
                  {cartCount === 1
                    ? "Item"
                    : "Items"})
                </span>
              )}

            </div>

            {hasSearch && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">

                <Search size={13} />

                <span>
                  Showing results for{" "}
                  <span className="font-semibold text-zinc-900">
                    "{searchQuery}"
                  </span>
                </span>

              </div>
            )}

          </div>

          {/* Actions */}
          {lineItems.length > 0 && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">

              <button
                type="button"
                onClick={
                  handleMoveAllToWishlist
                }
                className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 sm:flex-none sm:px-4 sm:text-xs"
              >
                <Heart size={14} />
                <span>
                  Move All to Wishlist
                </span>
              </button>

              <button
                type="button"
                onClick={
                  handleClearCart
                }
                className="flex min-h-9 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 sm:text-xs"
              >
                <Trash2 size={14} />
                <span>
                  Clear Cart
                </span>
              </button>

            </div>
          )}

        </div>

        {/* =====================================================
            EMPTY CART
        ====================================================== */}

        {lineItems.length === 0 ? (

          <div className="mt-6 sm:mt-8">
            <EmptyCartState />
          </div>

        ) : filteredLineItems.length === 0 ? (

          /* ===================================================
             NO SEARCH RESULTS
          ==================================================== */

          <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white px-5 text-center sm:mt-8">

            <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100">
              <Search
                size={20}
                className="text-zinc-500"
              />
            </div>

            <h2 className="mt-4 text-base font-bold text-zinc-900 sm:text-lg">
              No matching products
            </h2>

            <p className="mt-1 max-w-sm text-xs text-zinc-500 sm:text-sm">
              No products in your cart match{" "}
              <span className="font-semibold text-zinc-800">
                "{searchQuery}"
              </span>
              .
            </p>

          </div>

        ) : (

          /* ===================================================
             CART
          ==================================================== */

          <div className="mt-6 grid min-w-0 gap-5 lg:mt-8 lg:grid-cols-[1.6fr_1fr] lg:gap-6">

            {/* =================================================
                CART ITEMS
            ================================================== */}

            <div className="min-w-0">

              {/* Desktop column labels */}
              <div className="hidden items-center gap-6 px-5 pb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:flex">

                <div className="flex flex-1 items-center gap-4">

                  <input
                    type="checkbox"
                    aria-label="Select all items"
                    checked={
                      allSelected
                    }
                    onChange={
                      toggleSelectAll
                    }
                    className="size-4 shrink-0 rounded border-zinc-300 accent-zinc-900"
                  />

                  <span>
                    Product
                  </span>

                </div>

                <span className="w-40 shrink-0">
                  Delivery
                </span>

                <span className="w-32 shrink-0">
                  Actions
                </span>

              </div>

              {/* Mobile Select All */}
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 sm:hidden">

                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700">

                  <input
                    type="checkbox"
                    aria-label="Select all items"
                    checked={
                      allSelected
                    }
                    onChange={
                      toggleSelectAll
                    }
                    className="size-4 rounded border-zinc-300 accent-zinc-900"
                  />

                  Select all

                </label>

                <span className="text-[11px] text-zinc-400">
                  {filteredLineItems.length}{" "}
                  {filteredLineItems.length ===
                  1
                    ? "item"
                    : "items"}
                </span>

              </div>

              {/* Filtered cart items */}
              <div className="space-y-3 sm:space-y-4">

                {filteredLineItems.map(
                  ({
                    product,
                    quantity,
                  }) => (
                    <CartItem
                      key={product.id}
                      product={product}
                      quantity={quantity}
                      selected={selectedIds.has(
                        product.id
                      )}
                      onToggleSelect={() =>
                        toggleSelectOne(
                          product.id
                        )
                      }
                      onQuantityChange={(
                        nextQuantity
                      ) =>
                        updateCartQuantity(
                          product.id,
                          nextQuantity
                        )
                      }
                      onRemove={() =>
                        removeFromCart(
                          product.id
                        )
                      }
                    />
                  )
                )}

              </div>

              {/* Continue shopping */}
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 transition hover:text-zinc-950 sm:text-sm"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

              {/* Trust bar */}
              <div className="mt-5 sm:mt-6">
                <CartTrustBar />
              </div>

            </div>

            {/* =================================================
                SUMMARY
            ================================================== */}

            <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">

              <CartSummary
                itemCount={
                  selectedItemCount
                }
                productIds={
                  selectedProductIds
                }
              />

            </div>

          </div>
        )}

      </section>

      <Footer />

    </main>
  );
}