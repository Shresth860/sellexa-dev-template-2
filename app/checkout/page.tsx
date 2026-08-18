import { Suspense } from "react";

import CheckoutPage from "@/components/checkout/CheckoutPage";

export default function CheckoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f6f3]">
          <div className="font-medium text-zinc-500">Loading checkout...</div>
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
