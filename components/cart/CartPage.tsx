"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ArrowLeft, ChevronRight, Heart, Trash2 } from "lucide-react";

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
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
  } = useCart();

  const lineItems = useMemo(() => {
    return Object.entries(cartItems)
      .map(([productId, quantity]) => ({
        product: products.find((item) => item.id === Number(productId)),
        quantity,
      }))
      .filter((item): item is { product: (typeof products)[number]; quantity: number } =>
        Boolean(item.product)
      );
  }, [cartItems]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const knownIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const currentIds = new Set(lineItems.map((item) => item.product.id));

    setSelectedIds((prev) => {
      const next = new Set<number>();
      currentIds.forEach((id) => {
        if (prev.has(id) || !knownIdsRef.current.has(id)) {
          next.add(id);
        }
      });
      return next;
    });

    knownIdsRef.current = currentIds;
  }, [lineItems]);

  const selectedItemCount = useMemo(
    () =>
      lineItems
        .filter((item) => selectedIds.has(item.product.id))
        .reduce((total, item) => total + item.quantity, 0),
    [lineItems, selectedIds]
  );

  const allSelected = lineItems.length > 0 && selectedIds.size === lineItems.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(lineItems.map((item) => item.product.id)));
  };

  const toggleSelectOne = (productId: number) => {
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

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "This will remove all items from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-sans",
        title: "text-lg font-bold text-zinc-900",
        confirmButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",
        cancelButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-2xs",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      }
    });
  };

  const handleMoveAllToWishlist = () => {
    if (lineItems.length === 0) return;

    Swal.fire({
      title: "Move all to wishlist?",
      text: "All items will be moved from your cart to your wishlist.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, move them",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl font-sans",
        title: "text-lg font-bold text-zinc-900",
        confirmButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer",
        cancelButton: "rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-2xs",
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      lineItems.forEach(({ product }) => {
        toggleWishlist(product.id, true);
        removeFromCart(product.id);
      });

      Swal.fire({
        title: "Moved to wishlist",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-3xl font-sans",
          title: "text-lg font-bold text-zinc-900",
        },
      });
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-zinc-900">
      <Header
        query=""
        setQuery={() => {}}
        products={products}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        showBackHome
        backHomeHref="/"
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px] pb-16">
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900">Cart</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[32px] font-black leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-[40px] lg:text-[44px]">
              My Cart
            </h1>

            {cartCount > 0 && (
              <span className="text-sm font-medium text-zinc-500">
                ({cartCount} {cartCount === 1 ? "Item" : "Items"})
              </span>
            )}
          </div>

          {lineItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMoveAllToWishlist}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <Heart size={14} />
                Move All to Wishlist
              </button>

              <button
                type="button"
                onClick={handleClearCart}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {lineItems.length === 0 ? (
          <div className="mt-8">
            <EmptyCartState />
          </div>
        ) : (
          <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="min-w-0">
              <div className="hidden items-center gap-6 px-5 pb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:flex">
                <div className="flex flex-1 items-center gap-4">
                  <input
                    type="checkbox"
                    aria-label="Select all items"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="size-4 shrink-0 rounded border-zinc-300 accent-zinc-900"
                  />
                  <span>Product</span>
                </div>
                <span className="w-40 shrink-0">Delivery</span>
                <span className="w-32 shrink-0">Actions</span>
              </div>

              <div className="space-y-4">
                {lineItems.map(({ product, quantity }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantity}
                    selected={selectedIds.has(product.id)}
                    onToggleSelect={() => toggleSelectOne(product.id)}
                    onQuantityChange={(nextQuantity) => updateCartQuantity(product.id, nextQuantity)}
                    onRemove={() => removeFromCart(product.id)}
                  />
                ))}
              </div>

              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition hover:text-zinc-950"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

              <div className="mt-6">
                <CartTrustBar />
              </div>
            </div>

            <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
              <CartSummary itemCount={selectedItemCount} />
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
