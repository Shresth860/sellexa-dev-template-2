"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Heart, 
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { categories, type Product } from "@/data/product";

type HeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  onSearchSubmit?: () => void;
  products: Product[];
  setActiveCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  showBackHome?: boolean;
  backHomeHref?: string;
  hideCart?: boolean;
  hideWishlist?: boolean;
};

export default function Header({
  query,
  setQuery,
  onSearchSubmit,
  products,
  setActiveCategory,
  cartCount,
  wishlistCount,
  showBackHome = false,
  backHomeHref = "/",
  hideCart = false,
  hideWishlist = false,
}: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const searchValue = query.trim().toLowerCase();

  const categorySuggestions =
    searchValue && categories.length > 0
      ? categories
          .filter(
            (category) =>
              category !== "All" && category.toLowerCase().includes(searchValue)
          )
          .slice(0, 1)
      : [];

  const productSuggestions =
    searchValue
      ? products
          .filter((product) => {
            const searchable = [
              product.name,
              product.category,
              product.badge || "",
              ...(product.keywords || []),
            ]
              .join(" ")
              .toLowerCase();

            return searchable.includes(searchValue);
          })
          .slice(0, 4)
      : [];

  const suggestions = [...categorySuggestions.map((category) => ({
    type: "category" as const,
    label: `Categories: ${category}`,
    value: category,
  })), ...productSuggestions.map((product) => ({
    type: "product" as const,
    label: product.name,
    value: product.name,
    category: product.category,
    id: product.id,
  }))];

  const handleCategorySuggestionClick = (category: string) => {
    setQuery("");
    setActiveCategory(category);
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleProductSuggestionClick = (productId: number) => {
    setQuery("");
    router.push(`/product/${productId}`);
  };

  const userDisplayName = user ? (user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User") : "";

  const userInitials = userDisplayName
    ? userDisplayName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const handleCartNavigation = () => {
    router.push("/cart");
  };

  const handleWishlistNavigation = () => {
    router.push("/profile/wishlist");
  };

  return (
    <header className="mx-auto mt-3 w-[calc(100%-28px)] max-w-[1720px] ">
      {/* Main Header */}
      <div className="flex h-[76px] w-full items-center rounded-[22px] border border-zinc-200/80 bg-white px-3 shadow-sm sm:px-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 px-2 sm:px-3"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#171a18] text-sm font-black text-white">
            S
          </span>

          <span className="text-[15px] font-black tracking-[-0.04em]">
            SELLEXA
          </span>
        </Link>

        {/* Search */}
        <div className="relative ml-2 w-full max-w-[420px] sm:ml-4">
          <div className="group flex h-[56px] w-full items-center gap-2 rounded-[20px] border border-[#e7e5e4] bg-[linear-gradient(135deg,#fafaf9_0%,#f4f5f1_100%)] px-3 shadow-[0_10px_30px_rgba(23,25,24,0.06)] transition-all duration-200 focus-within:border-[#171a18] focus-within:shadow-[0_16px_40px_rgba(23,25,24,0.09)]">
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSearchSubmit?.();
                }
              }}
              placeholder="Search products..."
              className="min-w-0 flex-1 border-0 bg-transparent px-1 text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
            />

            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  onSearchSubmit?.();
                }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900"
                aria-label="Clear search"
              >
                <X width={14} height={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSearchSubmit?.();
                  searchInputRef.current?.focus();
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171a18] text-white shadow-[0_10px_18px_rgba(23,25,24,0.22)] transition hover:bg-zinc-800"
                aria-label="Search"
              >
                <Search width={15} height={15} />
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-[22px] border border-zinc-200 bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm">
              {suggestions.map((suggestion) =>
                suggestion.type === "category" ? (
                  <button
                    key={suggestion.value}
                    type="button"
                    className="block w-full border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50"
                    onClick={() => {
                      handleCategorySuggestionClick(suggestion.value);
                    }}
                  >
                    <span className="font-semibold">{suggestion.label}</span>
                  </button>
                ) : (
                  <button
                    key={suggestion.id}
                    type="button"
                    className="block w-full border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50"
                    onClick={() => {
                      handleProductSuggestionClick(suggestion.id);
                    }}
                  >
                    <span className="font-semibold">{suggestion.label}</span>
                    <span className="ml-2 text-[11px] font-medium text-zinc-500">
                      {suggestion.category}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">

          {!hideCart && (
            <button
              type="button"
              aria-label="Shopping cart"
              onClick={handleCartNavigation}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white p-0 text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <ShoppingBag
                width={19}
                height={19}
                strokeWidth={1.8}
              />

              {isHydrated && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#171a18] text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {!hideWishlist && (
            <button
              type="button"
              aria-label="Wishlist"
              onClick={handleWishlistNavigation}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white p-0 text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Heart
                width={19}
                height={19}
                fill="none"
                strokeWidth={1.8}
              />

              {isHydrated && wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#171a18] text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}


          {showBackHome && (
            <button
              type="button"
              onClick={() => router.push(backHomeHref)}
              className="hidden h-12 shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 sm:flex"
            >
              Back to home
            </button>
          )}

          {/* User Profile Link or Login Button */}
          {user ? (
            <Link
              href="/profile"
              className="hidden h-12 shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 pr-4 transition hover:border-zinc-300 hover:bg-zinc-50 sm:flex"
              title="My Profile"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#171a18] text-[11px] font-bold text-white ring-1 ring-zinc-200">
                {userInitials}
              </span>

              <span className="hidden whitespace-nowrap text-[11px] font-semibold text-zinc-800 md:block">
                {userDisplayName}
              </span>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <User width={15} height={15} />
                <span>Login</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex h-11 shrink-0 items-center rounded-full bg-[#171a18] px-4 text-xs font-semibold text-white transition hover:bg-zinc-800"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileMenu((value) => !value)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X
                width={19}
                height={19}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                width={19}
                height={19}
                strokeWidth={1.8}
              />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg lg:hidden">

          <nav className="flex flex-col gap-1">
            <a
              href="#shop"
              onClick={() => setMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              Shop
            </a>

            <a
              href="#deals"
              onClick={() => setMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              Deals
            </a>

            <a
              href="#new"
              onClick={() => setMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              New Arrivals
            </a>

            <a
              href="#categories"
              onClick={() => setMobileMenu(false)}
              className="rounded-xl px-4 py-3 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              Categories
            </a>
          </nav>

          {/* Mobile Search */}
          <div className="mt-3 flex h-11 items-center gap-2 rounded-xl bg-zinc-50 px-3">
            <Search
              width={16}
              height={16}
              className="shrink-0 text-zinc-500"
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>
      )}
    </header>
  );
}