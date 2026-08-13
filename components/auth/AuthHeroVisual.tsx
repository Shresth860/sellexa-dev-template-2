"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  Tag,
  ShoppingBag,
  Headphones,
  RotateCcw,
  Shield,
  Camera,
  Watch,
  Shirt,
  Gamepad2,
  Package,
} from "lucide-react";

interface AuthHeroVisualProps {
  mode: "login" | "signup";
  onGuestClick?: () => void;
  hideFooterBadgesOnMobile?: boolean;
}

export function AuthHeroVisual({
  mode,
  onGuestClick,
  hideFooterBadgesOnMobile = false,
}: AuthHeroVisualProps) {
  const router = useRouter();

  const handleGuest = () => {
    if (onGuestClick) {
      onGuestClick();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full bg-[#FAF9F5] text-zinc-900 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[#C5F237]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-52 h-52 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between z-10 w-full mb-3 lg:mb-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#141613] text-sm font-black text-white shadow-sm group-hover:scale-105 transition-transform">
            S
          </span>
          <span className="text-lg font-black tracking-tight text-zinc-900">
            Sellexa.
          </span>
        </Link>

        <button
          type="button"
          onClick={handleGuest}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 bg-white/80 hover:bg-white border border-zinc-200/80 rounded-full shadow-xs backdrop-blur-sm transition-all hover:shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-zinc-600" />
          <span>Shop as Guest</span>
        </button>
      </div>

      <div className="flex flex-col items-center text-center z-10 my-auto py-1 lg:py-2">
        {mode === "signup" && (
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#5B8C1D] mb-0.5 uppercase">
            Create Account
          </span>
        )}

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-950 tracking-tight leading-snug max-w-md">
          {mode === "login"
            ? "Welcome back! Glad to see you again"
            : "Let's get you started"}
        </h1>

        <p className="mt-1 text-xs text-zinc-600 max-w-xs leading-relaxed">
          {mode === "login"
            ? "Login to your account and continue shopping the best products."
            : "Create an account to enjoy seamless shopping and exciting offers."}
        </p>

        <div className="relative w-full max-w-[300px] sm:max-w-[340px] h-[180px] sm:h-[210px] lg:h-[230px] my-2 sm:my-3 lg:my-4 flex items-center justify-center">
          {mode === "login" ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#EEF7DF] to-[#E3F5C8]/60 absolute z-0" />

              <div className="absolute top-1 left-4 sm:left-6 bg-white p-2 rounded-xl shadow-md shadow-zinc-900/5 border border-zinc-100 z-20 animate-bounce" style={{ animationDuration: "3s" }}>
                <Gamepad2 className="w-4 h-4 text-zinc-800" />
              </div>

              <div className="absolute top-2 right-4 sm:right-8 bg-white p-2 rounded-xl shadow-md shadow-zinc-900/5 border border-zinc-100 z-20 animate-bounce" style={{ animationDuration: "3.5s" }}>
                <Headphones className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="absolute bottom-2 left-2 sm:left-4 bg-[#FFC72C] p-2 rounded-xl shadow-md z-20 animate-bounce" style={{ animationDuration: "4s" }}>
                <ShoppingBag className="w-4 h-4 text-zinc-950" />
              </div>

              <div className="absolute bottom-6 right-2 sm:right-4 bg-white p-2 rounded-xl shadow-md shadow-zinc-900/5 border border-zinc-100 z-20 animate-bounce" style={{ animationDuration: "3.2s" }}>
                <Camera className="w-4 h-4 text-zinc-700" />
              </div>

              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 filter drop-shadow-lg"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M40 50H160L145 130H55L40 50Z"
                    fill="url(#cartGrad)"
                    stroke="#181917"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path d="M40 75H155M45 100H150M50 125H145" stroke="#181917" strokeWidth="1.5" strokeOpacity="0.3" />
                  <path d="M70 50V130M100 50V130M130 50V130" stroke="#181917" strokeWidth="1.5" strokeOpacity="0.3" />

                  <circle cx="70" cy="155" r="14" fill="#181917" />
                  <circle cx="70" cy="155" r="6" fill="#FFFFFF" />
                  <circle cx="130" cy="155" r="14" fill="#181917" />
                  <circle cx="130" cy="155" r="6" fill="#FFFFFF" />

                  <path d="M25 35L40 50" stroke="#181917" strokeWidth="6" strokeLinecap="round" />

                  <rect x="60" y="30" width="45" height="35" rx="4" fill="#D9A76A" stroke="#181917" strokeWidth="2.5" />
                  <line x1="60" y1="45" x2="105" y2="45" stroke="#B38048" strokeWidth="2" />
                  <text x="66" y="42" fill="#181917" fontSize="8" fontWeight="bold">Nitec.</text>

                  <rect x="95" y="20" width="40" height="40" rx="4" fill="#C5F237" stroke="#181917" strokeWidth="2.5" />
                  <path d="M115 20V60" stroke="#181917" strokeWidth="2" />
                  <path d="M95 40H135" stroke="#181917" strokeWidth="2" />

                  <defs>
                    <linearGradient id="cartGrad" x1="40" y1="50" x2="160" y2="130" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#EEF7DF] to-[#DDF0BF]/60 absolute z-0" />

              <div className="absolute top-0 left-20 sm:left-24 bg-[#FFC72C] p-2 rounded-xl shadow-md z-20 animate-bounce" style={{ animationDuration: "3.2s" }}>
                <Shirt className="w-4 h-4 text-zinc-950" />
              </div>

              <div className="absolute top-10 left-2 sm:left-4 bg-white p-2 rounded-xl shadow-md shadow-zinc-900/5 border border-zinc-100 z-20 animate-bounce" style={{ animationDuration: "3.8s" }}>
                <Camera className="w-4 h-4 text-zinc-800" />
              </div>

              <div className="absolute top-12 right-2 sm:right-4 bg-white p-2 rounded-xl shadow-md shadow-zinc-900/5 border border-zinc-100 z-20 animate-bounce" style={{ animationDuration: "3.4s" }}>
                <Watch className="w-4 h-4 text-zinc-900" />
              </div>

              <div className="absolute bottom-2 right-2 sm:right-4 bg-[#D9A76A] p-2 rounded-xl shadow-md z-20 animate-bounce" style={{ animationDuration: "4s" }}>
                <Package className="w-4 h-4 text-zinc-950" />
              </div>

              <div className="relative z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-30 h-48 sm:w-36 sm:h-56 bg-[#141613] rounded-[30px] p-1.5 shadow-xl shadow-zinc-950/20 border-4 border-zinc-800 flex flex-col relative overflow-hidden">
                  <div className="w-12 h-2.5 bg-zinc-900 rounded-full mx-auto mb-1 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  </div>

                  <div className="w-full flex-1 bg-white rounded-[22px] p-2 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-1">
                      <div className="w-10 h-2 bg-zinc-900 rounded-full" />
                      <div className="w-3.5 h-3.5 bg-[#C5F237] rounded-full" />
                    </div>

                    <div className="w-full h-12 bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg p-1.5 flex flex-col justify-between border border-zinc-100">
                      <div className="w-14 h-1.5 bg-zinc-800 rounded-full" />
                      <div className="w-16 h-1.5 bg-[#5B8C1D] rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-7 bg-zinc-100 rounded-md p-1" />
                      <div className="h-7 bg-zinc-100 rounded-md p-1" />
                    </div>

                    <div className="w-full h-5 bg-[#C5F237] rounded-lg flex items-center justify-center">
                      <span className="text-[8px] font-bold text-zinc-950">Sellexa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 w-full max-w-md mt-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-full border border-zinc-200/70 shadow-2xs text-[11px] font-semibold text-zinc-800">
            <div className="w-5 h-5 rounded-full bg-[#EBF7E5] text-[#5B8C1D] grid place-items-center">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <span>Secure Payments</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-full border border-zinc-200/70 shadow-2xs text-[11px] font-semibold text-zinc-800">
            <div className="w-5 h-5 rounded-full bg-[#F0ECFE] text-indigo-600 grid place-items-center">
              <Truck className="w-3 h-3" />
            </div>
            <span>Fast & Free Delivery</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-full border border-zinc-200/70 shadow-2xs text-[11px] font-semibold text-zinc-800">
            <div className="w-5 h-5 rounded-full bg-[#FDEEE9] text-rose-600 grid place-items-center">
              <Tag className="w-3 h-3" />
            </div>
            <span>Best Prices Everyday</span>
          </div>
        </div>
      </div>

      {!hideFooterBadgesOnMobile && (
        <div className="z-10 pt-3 border-t border-zinc-200/60 mt-2 hidden sm:flex items-center justify-around text-center text-[10px] sm:text-[11px] text-zinc-600 font-medium">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#5B8C1D]" />
            <span>100% Secure</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <div className="flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5 text-indigo-600" />
            <span>24/7 Support</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>7-Day Returns</span>
          </div>
        </div>
      )}
    </div>
  );
}
