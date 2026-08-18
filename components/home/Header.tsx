"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  categories,
  products as allProducts,
} from "@/data/product";

type HeaderProps = {
  /**
   * Legacy props are kept for compatibility.
   * CartContext is the primary search state.
   */
  query?: string;
  setQuery?: (value: string) => void;
  onSearchSubmit?: () => void;

  products?: typeof allProducts;
  setActiveCategory?: (category: string) => void;

  cartCount?: number;
  wishlistCount?: number;

  showBackHome?: boolean;
  backHomeHref?: string;

  hideCart?: boolean;
  hideWishlist?: boolean;
};

export default function Header({
  query,
  setQuery,
  onSearchSubmit,
  products = allProducts,
  setActiveCategory,
  cartCount: cartCountProp,
  wishlistCount: wishlistCountProp,
  showBackHome = false,
  backHomeHref = "/",
  hideCart = false,
  hideWishlist = false,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  const { user } = useAuth();

  const {
    searchQuery: contextSearchQuery,
    setSearchQuery: setContextSearchQuery,
    clearSearch,
    cartCount: contextCartCount,
    wishlistCount: contextWishlistCount,
  } = useCart();

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  /*
   * --------------------------------------------------
   * SEARCH SOURCE
   * --------------------------------------------------
   *
   * CartContext is the main source of truth.
   *
   * Legacy query/setQuery props are supported so
   * older pages do not break.
   */
  const usingLegacySearchProps =
    typeof query === "string" &&
    typeof setQuery === "function";

  const currentQuery = usingLegacySearchProps
    ? query
    : contextSearchQuery;

  const updateQuery = (value: string) => {
    if (usingLegacySearchProps) {
      setQuery(value);
    }

    setContextSearchQuery(value);
  };

  /*
   * --------------------------------------------------
   * LOCAL SEARCH PAGES
   * --------------------------------------------------
   *
   * On these pages search NEVER navigates:
   *
   * /cart
   * /wishlist
   * /orders
   */
  const localSearchPage =
    pathname === "/cart" ||
    pathname === "/wishlist" ||
    pathname === "/orders";

  /*
   * Clear search when changing pages.
   */
  useEffect(() => {
    clearSearch();
    setSearchOpen(false);
    setMobileMenu(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /*
   * Close search suggestions when clicking outside.
   */
  useEffect(() => {
    const handlePointerDown = (
      event: MouseEvent
    ) => {
      const target =
        event.target as HTMLElement;

      if (
        searchOpen &&
        !target.closest(
          "[data-sellexa-search]"
        )
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );
    };
  }, [searchOpen]);

  const cartCount =
    cartCountProp ?? contextCartCount;

  const wishlistCount =
    wishlistCountProp ??
    contextWishlistCount;

  const searchValue = (
    currentQuery ?? ""
  )
    .trim()
    .toLowerCase();

  /*
   * --------------------------------------------------
   * SEARCH SUGGESTIONS
   * --------------------------------------------------
   */
  const suggestions = useMemo(() => {
    if (!searchValue) {
      return [];
    }

    const categorySuggestions = categories
      .filter(
        (category) =>
          category !== "All" &&
          category
            .toLowerCase()
            .includes(searchValue)
      )
      .slice(0, 1)
      .map((category) => ({
        type: "category" as const,
        label: `Categories: ${category}`,
        value: category,
      }));

    const productSuggestions = products
      .filter((product) => {
        const searchable = [
          product.name,
          product.category,
          product.badge ?? "",
          ...(product.keywords ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(
          searchValue
        );
      })
      .slice(0, 4)
      .map((product) => ({
        type: "product" as const,
        label: product.name,
        value: product.name,
        category: product.category,
        id: product.id,
      }));

    return [
      ...categorySuggestions,
      ...productSuggestions,
    ];
  }, [products, searchValue]);

  /*
   * --------------------------------------------------
   * SEARCH SUBMIT
   * --------------------------------------------------
   */
  const handleSearch = () => {
    const value = (
      currentQuery ?? ""
    ).trim();

    /*
     * CART / WISHLIST / ORDERS
     *
     * NEVER navigate.
     *
     * The current page reads searchQuery from
     * CartContext and filters its own content.
     */
    if (localSearchPage) {
      setContextSearchQuery(value);
      setSearchOpen(false);
      return;
    }

    /*
     * SEARCH PAGE
     */
    if (pathname === "/search") {
      if (value) {
        router.push(
          `/search?q=${encodeURIComponent(
            value
          )}`
        );
      } else {
        router.push("/search");
      }

      setSearchOpen(false);
      return;
    }

    /*
     * ALL OTHER PAGES
     */
    if (value) {
      router.push(
        `/search?q=${encodeURIComponent(value)}`
      );
    } else {
      router.push("/search");
    }

    setSearchOpen(false);

    onSearchSubmit?.();
  };

  /*
   * --------------------------------------------------
   * CLEAR SEARCH
   * --------------------------------------------------
   */
  const handleClearSearch = () => {
    updateQuery("");
    setSearchOpen(false);

    if (localSearchPage) {
      setContextSearchQuery("");
      return;
    }

    onSearchSubmit?.();
  };

  /*
   * --------------------------------------------------
   * CATEGORY SUGGESTION
   * --------------------------------------------------
   */
  const handleCategorySuggestionClick = (
    category: string
  ) => {
    /*
     * On local pages, category is simply used as
     * the search/filter value.
     */
    if (localSearchPage) {
      updateQuery(category);
      setSearchOpen(false);
      return;
    }

    updateQuery("");
    setSearchOpen(false);

    setActiveCategory?.(category);

    router.push(
      `/search?category=${encodeURIComponent(
        category
      )}`
    );
  };

  /*
   * --------------------------------------------------
   * PRODUCT SUGGESTION
   * --------------------------------------------------
   */
  const handleProductSuggestionClick = (
    productId: number
  ) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    if (!selectedProduct) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * On /cart, /wishlist and /orders,
     * clicking a suggestion MUST NOT open
     * product details.
     *
     * Instead it filters the current page.
     */
    if (localSearchPage) {
      updateQuery(selectedProduct.name);
      setSearchOpen(false);
      return;
    }

    /*
     * Other pages can open product details.
     */
    updateQuery("");
    setSearchOpen(false);

    router.push(
      `/product/${productId}`
    );
  };

  /*
   * --------------------------------------------------
   * USER
   * --------------------------------------------------
   */
  const userDisplayName = user
    ? user.name ||
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim() ||
      "User"
    : "";

  const userInitials = userDisplayName
    ? userDisplayName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1780px] items-center gap-2 px-3 sm:min-h-[68px] sm:px-5 lg:min-h-[72px] lg:px-8">

        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          href="/"
          onClick={() => {
            clearSearch();
            setSearchOpen(false);
            setMobileMenu(false);
          }}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#171a18] text-sm font-black text-white sm:h-9 sm:w-9">
            S
          </span>

          <span className="text-[15px] font-black tracking-[-0.04em] sm:text-base">
            SELLEXA
          </span>
        </Link>

        {/* =====================================================
            DESKTOP SEARCH
        ====================================================== */}
        <div
          data-sellexa-search
          className="relative ml-4 hidden w-full max-w-[480px] lg:block"
        >
          <div className="flex h-11 w-full items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3 transition focus-within:border-zinc-400 focus-within:bg-white focus-within:shadow-sm">
            <Search
              size={17}
              strokeWidth={1.8}
              className="shrink-0 text-zinc-400"
            />

            <input
              ref={searchInputRef}
              type="text"
              value={currentQuery ?? ""}
              onChange={(event) =>
                updateQuery(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch();
                }

                if (event.key === "Escape") {
                  handleClearSearch();
                }
              }}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
            />

            {currentQuery?.trim() ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);

                  requestAnimationFrame(
                    () => {
                      searchInputRef.current?.focus();
                    }
                  );
                }}
                aria-label="Search"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#171a18] text-white transition hover:bg-zinc-800"
              >
                <Search size={14} />
              </button>
            )}
          </div>

          {searchValue &&
            suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                onCategoryClick={
                  handleCategorySuggestionClick
                }
                onProductClick={
                  handleProductSuggestionClick
                }
              />
            )}
        </div>

        <div className="flex-1" />

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}
        <div className="hidden items-center gap-2 lg:flex">

          {!hideCart && (
            <button
              type="button"
              onClick={() =>
                router.push("/cart")
              }
              aria-label="Shopping cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
            >
              <ShoppingBag
                size={18}
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <Badge count={cartCount} />
              )}
            </button>
          )}

          {!hideWishlist && (
            <button
              type="button"
              onClick={() =>
                router.push("/wishlist")
              }
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50"
            >
              <Heart
                size={18}
                strokeWidth={1.8}
              />

              {wishlistCount > 0 && (
                <Badge
                  count={wishlistCount}
                />
              )}
            </button>
          )}

          {showBackHome && (
            <button
              type="button"
              onClick={() =>
                router.push(backHomeHref)
              }
              className="h-10 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-700 transition hover:bg-zinc-100"
            >
              Back to home
            </button>
          )}

          {user ? (
            <Link
              href="/profile"
              className="flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 pr-3 transition hover:bg-zinc-50"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#171a18] text-[10px] font-bold text-white">
                {userInitials}
              </span>

              <span className="max-w-[110px] truncate text-[11px] font-semibold text-zinc-800">
                {userDisplayName}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <User size={14} />
              Login
            </Link>
          )}
        </div>

        {/* =====================================================
            MOBILE SEARCH BUTTON
        ====================================================== */}
        <button
          type="button"
          onClick={() => {
            setSearchOpen(
              (value) => !value
            );
            setMobileMenu(false);
          }}
          aria-label={
            searchOpen
              ? "Close search"
              : "Search products"
          }
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 transition active:scale-95 lg:hidden"
        >
          {searchOpen ? (
            <X
              size={19}
              strokeWidth={1.8}
            />
          ) : (
            <Search
              size={19}
              strokeWidth={1.8}
            />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE SEARCH
      ====================================================== */}
      {searchOpen && (
        <div
          data-sellexa-search
          className="border-t border-zinc-100 bg-white px-3 pb-3 pt-2 lg:hidden"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
            className="relative"
          >
            <div className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 focus-within:border-zinc-400 focus-within:bg-white">
              <Search
                size={17}
                className="shrink-0 text-zinc-400"
              />

              <input
                autoFocus
                type="text"
                value={currentQuery ?? ""}
                onChange={(event) =>
                  updateQuery(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search products..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
              />

              {currentQuery?.trim() && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-zinc-500 transition active:scale-95"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {searchValue &&
            suggestions.length > 0 && (
              <div className="mt-2">
                <SearchSuggestions
                  suggestions={suggestions}
                  onCategoryClick={
                    handleCategorySuggestionClick
                  }
                  onProductClick={
                    handleProductSuggestionClick
                  }
                />
              </div>
            )}
        </div>
      )}
    </header>
  );
}

/* ============================================================
   BADGE
============================================================ */

function Badge({
  count,
}: {
  count: number;
}) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#171a18] px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/* ============================================================
   SEARCH SUGGESTIONS
============================================================ */

type Suggestion =
  | {
      type: "category";
      label: string;
      value: string;
    }
  | {
      type: "product";
      label: string;
      value: string;
      category: string;
      id: number;
    };

function SearchSuggestions({
  suggestions,
  onCategoryClick,
  onProductClick,
}: {
  suggestions: Suggestion[];
  onCategoryClick: (
    category: string
  ) => void;
  onProductClick: (
    productId: number
  ) => void;
}) {
  return (
    <div className="max-h-[280px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
      {suggestions.map((suggestion) =>
        suggestion.type === "category" ? (
          <button
            key={`category-${suggestion.value}`}
            type="button"
            onClick={() =>
              onCategoryClick(
                suggestion.value
              )
            }
            className="block w-full border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50 active:bg-zinc-100"
          >
            <span className="font-semibold">
              {suggestion.label}
            </span>
          </button>
        ) : (
          <button
            key={`product-${suggestion.id}`}
            type="button"
            onClick={() =>
              onProductClick(
                suggestion.id
              )
            }
            className="block w-full border-b border-zinc-100 px-4 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50 active:bg-zinc-100"
          >
            <span className="font-semibold">
              {suggestion.label}
            </span>

            <span className="ml-2 text-[11px] font-medium text-zinc-500">
              {suggestion.category}
            </span>
          </button>
        )
      )}
    </div>
  );
}