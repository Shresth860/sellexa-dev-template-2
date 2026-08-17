"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

import CouponInput, { type AppliedCoupon } from "./CouponInput";
import DeliveryAddressStep from "./DeliveryAddressStep";
import OrderSummarySidebar, { type OrderSummaryLineItem } from "./OrderSummarySidebar";
import PaymentMethodStep, { type PaymentMethod } from "./PaymentMethodStep";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { cartItems, cartCount, wishlistCount } = useCart();

  const [manualAddressId, setManualAddressId] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const selectedAddressId = useMemo(() => {
    if (!user) return null;
    if (manualAddressId && user.addresses.some((address) => address.id === manualAddressId)) {
      return manualAddressId;
    }

    const defaultAddress = user.addresses.find((address) => address.isDefault) ?? user.addresses[0];
    return defaultAddress ? defaultAddress.id : null;
  }, [user, manualAddressId]);

  const requestedIds = useMemo(() => {
    const raw = searchParams.get("items");
    if (!raw) return null;

    return new Set(
      raw
        .split(",")
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
    );
  }, [searchParams]);

  const checkoutItems = useMemo(() => {
    return Object.entries(cartItems)
      .filter(([productId]) => !requestedIds || requestedIds.has(Number(productId)))
      .map(([productId, quantity]) => {
        const product = products.find((item) => item.id === Number(productId));
        if (!product) return null;

        const lineItem: OrderSummaryLineItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          color: product.color,
          quantity,
          price: product.price,
          oldPrice: product.oldPrice,
        };

        return lineItem;
      })
      .filter((item): item is OrderSummaryLineItem => item !== null);
  }, [cartItems, requestedIds]);

  const subtotal = useMemo(
    () => checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [checkoutItems]
  );

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
        backHomeHref="/cart"
        hideCart
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px] pb-16">
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="transition hover:text-zinc-900">
            Cart
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-900">Checkout</span>
        </div>

        <h1 className="mt-3 text-[32px] font-black leading-[0.95] tracking-tighter text-zinc-950 sm:text-[40px] lg:text-[44px]">
          Checkout
        </h1>

        {checkoutItems.length === 0 ? (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 px-5 text-center">
            <h3 className="text-lg font-bold text-zinc-900">No items to checkout</h3>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Head back to your cart and select the items you&apos;d like to buy.
            </p>
            <Link
              href="/cart"
              className="mt-5 rounded-xl bg-[#171a18] px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Back to Cart
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
              <DeliveryAddressStep
                selectedAddressId={selectedAddressId}
                onSelectAddress={setManualAddressId}
                orderNotes={orderNotes}
                onOrderNotesChange={setOrderNotes}
              />

              <PaymentMethodStep selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod} />

              <div className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
                <CouponInput
                  subtotal={subtotal}
                  appliedCoupon={appliedCoupon}
                  onApply={setAppliedCoupon}
                  onRemove={() => setAppliedCoupon(null)}
                />

                <OrderSummarySidebar
                  items={checkoutItems}
                  couponCode={appliedCoupon?.code}
                  couponDiscount={appliedCoupon?.amount ?? 0}
                  ctaLabel="Review & Place Order"
                  ctaDisabled={!selectedAddressId}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
