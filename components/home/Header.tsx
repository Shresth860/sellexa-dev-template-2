"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/data/product";
import { dummyUser as user } from "@/data/user";

type HeaderProps = {
  query: string;
  setQuery: (value: string) => void;
  products: Product[];
  setActiveCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  showBackHome?: boolean;
  backHomeHref?: string;
};

export default function Header({
  query,
  setQuery,
  products,
  setActiveCategory,
  cartCount,
  wishlistCount,
  showBackHome = false,
  backHomeHref = "/",
}: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { user: authUser, isLoggedIn, openAuthModal, logout } = useAuth();

  const suggestions = query
    .trim()
    .toLowerCase()
    ? products
        .filter((product) => {
          const search = query.toLowerCase();
          const searchable = [
            product.name,
            product.category,
            product.badge || "",
            ...(product.keywords || []),
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(search);
        })
        .slice(0, 5)
    : [];

  const displayUser = authUser ?? user;

  const userInitials = displayUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleUserAction = () => {
    if (isLoggedIn) {
      logout();
      return;
    }

    openAuthModal("login");
  };

  const handleCartNavigation = () => {
    router.push("/cart");
  };

  const handleWishlistNavigation = () => {
    router.push("/wishlist");
  };

  return (
    <header className="mx-auto mt-3 w-[calc(100%-28px)] max-w-[1720px] ">
      {/* Main Header */}
      <div className="flex h-[76px] w-full items-center rounded-[22px] border border-zinc-200/80 bg-white px-3 shadow-sm sm:px-4">

        {/* Logo */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-2 px-2 sm:px-3"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#171a18] text-sm font-black text-white">
            S
          </span>

          <span className="text-[15px] font-black tracking-[-0.04em]">
            SELLEXA
          </span>
        </a>

        {/* Search */}
        <div className="relative ml-2 w-full max-w-[330px] sm:ml-4">
          <div className="flex h-[52px] w-full items-center rounded-[18px] bg-[#f5f6f3] px-3">
            <Search
              width={17}
              height={17}
              className="shrink-0 text-zinc-500"
            />

            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />

            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="shrink-0 text-zinc-400 transition hover:text-zinc-900"
                aria-label="Clear search"
              >
                <X
                  width={15}
                  height={15}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => searchInputRef.current?.focus()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171a18] text-white"
                aria-label="Search"
              >
                <Search
                  width={15}
                  height={15}
                />
              </button>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
              {suggestions.map((product) => (
                <a
                  key={product.id}
                  href={`#product-${product.id}`}
                  className="block border-b border-zinc-100 px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-50"
                  onClick={() => {
                    setQuery(product.name);
                    setActiveCategory(product.category);
                  }}
                >
                  <span className="font-semibold">
                    {product.name}
                  </span>

                  <span className="ml-2 text-xs text-zinc-500">
                    {product.category}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Cart */}
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

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#171a18] text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Wishlist */}
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

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#171a18] text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {showBackHome && (
            <button
              type="button"
              onClick={() => router.push(backHomeHref)}
              className="hidden h-12 shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-50 px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 sm:flex"
            >
              Back to home
            </button>
          )}

          {/* User */}
          <button
            type="button"
            onClick={handleUserAction}
            className="hidden h-12 shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 pr-4 transition hover:border-zinc-300 hover:bg-zinc-50 sm:flex"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f8faf4] text-[11px] font-bold text-zinc-900 ring-1 ring-zinc-200">
              {userInitials}
            </span>

            <span className="hidden whitespace-nowrap text-[11px] font-semibold text-zinc-800 md:block">
              {isLoggedIn ? displayUser.name : "Login"}
            </span>
          </button>

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