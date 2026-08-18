"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Search, Trash2 } from "lucide-react";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

import CartItem from "./CartItem";
import CartTrustBar from "./CartTrustBar";
import CouponCode, {
  type AppliedCoupon,
} from "./CouponCode";
import EmptyCartState from "./EmptyCartState";
import OrderSummary from "./OrderSummary";
import WhyShopCard from "./WhyShopCard";

const TAX_RATE = 0.18;

const AVAILABLE_COUPONS: Record<
  string,
  {
    type: "percent" | "flat";
    value: number;
    label: string;
  }
> = {
  SAVE10: {
    type: "percent",
    value: 10,
    label: "10% off on your order",
  },
  FLAT500: {
    type: "flat",
    value: 500,
    label: "₹500 off on your order",
  },
};

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    wishlistCount,

    /* Shared search state */
    searchQuery,

    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  /*
   * Build cart line items
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
   * Search cart items
   *
   * IMPORTANT:
   * This uses the SAME searchQuery that Header updates.
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
   * Cart subtotal
   */
  const subtotal = useMemo(
    () =>
      filteredLineItems.reduce(
        (total, item) =>
          total +
          item.product.price *
            item.quantity,
        0
      ),
    [filteredLineItems]
  );

  /*
   * Visible item count
   */
  const filteredItemCount = useMemo(
    () =>
      filteredLineItems.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [filteredLineItems]
  );

  const [
    appliedCoupon,
    setAppliedCoupon,
  ] = useState<AppliedCoupon | null>(
    null
  );

  /*
   * Discount
   */
  const discount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    const coupon =
      AVAILABLE_COUPONS[
        appliedCoupon.code
      ];

    if (!coupon) {
      return 0;
    }

    const rawDiscount =
      coupon.type === "percent"
        ? (subtotal * coupon.value) /
          100
        : coupon.value;

    return Math.min(
      Math.round(rawDiscount),
      subtotal
    );
  }, [
    appliedCoupon,
    subtotal,
  ]);

  const discountedSubtotal =
    subtotal - discount;

  const tax = Math.round(
    discountedSubtotal * TAX_RATE
  );

  const total =
    discountedSubtotal + tax;

  /*
   * Apply coupon
   */
  const handleApplyCoupon = (
    code: string
  ) => {
    const normalizedCode =
      code.toUpperCase();

    const coupon =
      AVAILABLE_COUPONS[
        normalizedCode
      ];

    if (!coupon) {
      return false;
    }

    setAppliedCoupon({
      code: normalizedCode,
      label: coupon.label,
    });

    return true;
  };

  /*
   * Remove coupon
   */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  /*
   * Clear cart
   */
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

  const hasSearchQuery =
    searchQuery.trim().length > 0;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-zinc-900">

      {/* Header */}
      <Header />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px] pb-16">

        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>

            <div className="flex items-center gap-2.5">

              <h1 className="max-w-xl text-[32px] font-black leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-[40px] lg:text-[44px]">
                Your Cart
              </h1>

              {cartCount > 0 && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "Item"
                    : "Items"}
                </span>
              )}

            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Review your items and proceed to
              checkout.
            </p>

            {/* Search status */}
            {hasSearchQuery && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-zinc-500">

                <Search size={14} />

                <span>
                  Showing results for{" "}

                  <span className="font-semibold text-zinc-900">
                    "{searchQuery}"
                  </span>
                </span>

              </div>
            )}

          </div>

          {/* Clear Cart */}
          {cartCount > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Clear Cart
            </button>
          )}

        </div>

        {/* Completely empty cart */}
        {lineItems.length === 0 ? (

          <div className="mt-8">
            <EmptyCartState />
          </div>

        ) : filteredLineItems.length === 0 ? (

          /* No search results */
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-black/10 bg-white px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Search
                size={22}
                strokeWidth={1.7}
                className="text-zinc-500"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-zinc-900">
              No matching products
            </h2>

            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              No products in your cart match{" "}

              <span className="font-semibold text-zinc-700">
                "{searchQuery}"
              </span>
              .
            </p>

          </div>

        ) : (

          <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">

            {/* Cart Items */}
            <div className="min-w-0 space-y-4">

              {filteredLineItems.map(
                ({
                  product,
                  quantity,
                }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantity}

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

              <CartTrustBar />

            </div>

            {/* Order Summary */}
            <div className="min-w-0 space-y-6 xl:sticky xl:top-6 xl:self-start">

              <CouponCode
                appliedCoupon={
                  appliedCoupon
                }
                onApply={
                  handleApplyCoupon
                }
                onRemove={
                  handleRemoveCoupon
                }
              />

              <OrderSummary
                itemCount={
                  filteredItemCount
                }
                subtotal={subtotal}
                discount={discount}
                couponCode={
                  appliedCoupon?.code
                }
                tax={tax}
                total={total}
              />

              <WhyShopCard />

            </div>

          </div>

        )}

      </section>

      <Footer />

    </main>
  );
}