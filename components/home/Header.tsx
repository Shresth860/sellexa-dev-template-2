"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  UserRound,
  ChevronDown,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#featured-products" },
  { label: "Categories", href: "/#categories" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "New Arrivals", href: "/#new-arrivals" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

 const {
  searchQuery,
  setSearchQuery,
  clearSearch,
} = useCart();
// ✅ Correct
useEffect(() => {
  clearSearch();
  setSearchOpen(false);
}, [pathname]);

  const [searchOpen, setSearchOpen] = useState(false);

  const stayOnCurrentPage =
    pathname === "/cart" ||
    pathname === "/wishlist" ||
    pathname === "/orders";

  const handleSearch = () => {
    const value = searchQuery.trim();

    /*
     * Cart, Wishlist and Orders:
     *
     * Do NOT change the URL.
     * The SearchContext value is already shared
     * with those pages, so they can filter their
     * own content.
     */
    if (stayOnCurrentPage) {
      setSearchQuery(value);
      setSearchOpen(false);
      return;
    }

    /*
     * Search page:
     *
     * Search results are shown on /search.
     */
    if (pathname === "/search") {
      if (value) {
        router.push(
          `/search?q=${encodeURIComponent(value)}`
        );
      } else {
        router.push("/search");
      }

      setSearchOpen(false);
      return;
    }

    /*
     * All other pages:
     *
     * Navigate to the global search page.
     */
    if (value) {
      router.push(
        `/search?q=${encodeURIComponent(value)}`
      );
    } else {
      router.push("/search");
    }

    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleLogoClick = () => {
    closeSearch();
    clearSearch();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1780px] items-center px-4 sm:px-6 lg:h-[72px] lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0"
          onClick={handleLogoClick}
        >
          <span className="text-[22px] font-semibold tracking-[-0.04em] text-black sm:text-2xl">
            Sellexa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-12 hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-1.5 text-[13px] font-medium text-black/75 transition hover:text-black"
            >
              {item.label}

              {item.label === "Categories" && (
                <ChevronDown
                  size={14}
                  strokeWidth={1.7}
                  className="transition-transform group-hover:rotate-180"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="ml-auto hidden items-center gap-1 lg:flex">

          {/* Search */}
          <button
            type="button"
            aria-label={
              searchOpen
                ? "Close search"
                : "Search products"
            }
            onClick={toggleSearch}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
          >
            {searchOpen ? (
              <X
                size={19}
                strokeWidth={1.7}
              />
            ) : (
              <Search
                size={19}
                strokeWidth={1.7}
              />
            )}
          </button>

          {/* Account */}
          <Link
            href="/account"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5"
          >
            <UserRound
              size={19}
              strokeWidth={1.7}
            />
          </Link>
        </div>

        {/* Mobile Search */}
        <button
          type="button"
          aria-label={
            searchOpen
              ? "Close search"
              : "Search products"
          }
          onClick={toggleSearch}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 lg:hidden"
        >
          {searchOpen ? (
            <X
              size={20}
              strokeWidth={1.8}
            />
          ) : (
            <Search
              size={20}
              strokeWidth={1.8}
            />
          )}
        </button>

        {/* Search Bar */}
        {searchOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%+8px)] z-50 sm:left-auto sm:right-6 sm:w-[420px] lg:right-8">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
              className="flex h-12 items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 shadow-[0_12px_35px_rgba(0,0,0,0.12)]"
            >
              {/* Search Icon */}
              <Search
                size={18}
                strokeWidth={1.7}
                className="shrink-0 text-black/45"
              />

              {/* Search Input */}
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/40"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="flex h-8 shrink-0 items-center rounded-xl bg-black px-3 text-xs font-medium text-white transition hover:bg-black/80"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}