"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import ProductCard from "./ProductCard";
import EmptyProductState from "./EmptyProductState";

import type { Product } from "@/data/product";

type ProductSectionProps = {
  products: Product[];
  query: string;
  activeCategory: string;
  setQuery: (value: string) => void;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onCartQuantityChange: (
    productId: number,
    nextQuantity: number
  ) => void;
  onToggleWishlist: (
    productId: number,
    isActive: boolean
  ) => void;
};

const PRODUCTS_PER_LOAD = 4;

export default function ProductSection({
  products,
  query,
  activeCategory,
  setQuery,
  setActiveCategory,
  sortBy,
  setSortBy,
  onCartQuantityChange,
  onToggleWishlist,
}: ProductSectionProps) {
  /* ==========================================
     SORT
  ========================================== */

  const [isSortOpen, setIsSortOpen] =
    useState(false);

  const sortRef =
    useRef<HTMLDivElement | null>(null);

  const sortOptions = [
    "Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
  ];

  /* ==========================================
     HORIZONTAL PRODUCT SCROLL
  ========================================== */

  const scrollContainerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Prevent multiple automatic loads from
   * happening while the previous load is
   * still rendering.
   */
  const loadingRef = useRef(false);

  /*
   * Number of products currently rendered.
   *
   * Initial = 4
   */
  const [visibleCount, setVisibleCount] =
    useState(() =>
      Math.min(
        PRODUCTS_PER_LOAD,
        products.length
      )
    );

  /*
   * Products that are actually displayed.
   *
   * IMPORTANT:
   * These come directly from the products prop,
   * which comes from data/product.ts.
   */
  const visibleProducts = products.slice(
    0,
    visibleCount
  );

  /*
   * Are there still products waiting to load?
   */
  const hasMoreProducts =
    visibleCount < products.length;

  /* ==========================================
     RESET WHEN FILTER / SORT / SEARCH CHANGES
  ========================================== */

  useEffect(() => {
    /*
     * Start with the first 4 products again.
     */
    setVisibleCount(
      Math.min(
        PRODUCTS_PER_LOAD,
        products.length
      )
    );

    loadingRef.current = false;

    /*
     * Return horizontal scroll to the beginning.
     */
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [products]);

  /* ==========================================
     LOAD MORE PRODUCTS
  ========================================== */

  const loadMore = useCallback(
    (automatic = false) => {
      /*
       * Don't start another load while
       * one is already happening.
       */
      if (loadingRef.current) {
        return;
      }

      /*
       * Nothing left to load.
       */
      if (visibleCount >= products.length) {
        return;
      }

      const container =
        scrollContainerRef.current;

      if (!container) {
        return;
      }

      loadingRef.current = true;

      /*
       * Save current scroll position and
       * width before rendering more cards.
       */
      const previousScrollLeft =
        container.scrollLeft;

      const previousScrollWidth =
        container.scrollWidth;

      /*
       * Add the next 4 products.
       */
      const nextVisibleCount = Math.min(
        visibleCount + PRODUCTS_PER_LOAD,
        products.length
      );

      setVisibleCount(nextVisibleCount);

      /*
       * Wait for React to render the
       * newly added ProductCards.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const updatedContainer =
            scrollContainerRef.current;

          if (!updatedContainer) {
            loadingRef.current = false;
            return;
          }

          const newScrollWidth =
            updatedContainer.scrollWidth;

          const addedWidth =
            newScrollWidth -
            previousScrollWidth;

          /*
           * Automatic loading happens when the
           * user reaches the end.
           *
           * Move smoothly into the newly loaded
           * products instead of stopping.
           */
          if (
            automatic &&
            addedWidth > 0
          ) {
            updatedContainer.scrollTo({
              left:
                previousScrollLeft +
                Math.min(
                  addedWidth,
                  updatedContainer.clientWidth *
                    0.75
                ),
              behavior: "smooth",
            });
          }

          loadingRef.current = false;
        });
      });
    },
    [products.length, visibleCount]
  );

  /* ==========================================
     NATIVE WHEEL → HORIZONTAL SCROLL
     
     This uses a native wheel listener with
     passive:false so preventDefault() works
     reliably and behaves much closer to
     Shift + mouse-wheel.
  ========================================== */

  useEffect(() => {
    const container =
      scrollContainerRef.current;

    if (!container) {
      return;
    }

    const handleWheel = (
      event: WheelEvent
    ) => {
      /*
       * Prefer deltaY because the desired behavior
       * is:
       *
       * Wheel Down → Horizontal Right
       * Wheel Up   → Horizontal Left
       *
       * If the device already produces horizontal
       * deltaX, use whichever movement is stronger.
       */
      let delta =
        Math.abs(event.deltaY) >=
        Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (delta === 0) {
        return;
      }

      /*
       * Normalize line/page based wheel events.
       */
      if (event.deltaMode === 1) {
        delta *= 16;
      } else if (event.deltaMode === 2) {
        delta *= container.clientHeight;
      }

      /*
       * Current horizontal boundaries.
       */
      const maxScroll =
        container.scrollWidth -
        container.clientWidth;

      /*
       * If there isn't enough content to
       * overflow horizontally, let the page
       * scroll normally.
       */
      if (maxScroll <= 0) {
        return;
      }

      const currentScroll =
        container.scrollLeft;

      const atStart =
        currentScroll <= 1;

      const atEnd =
        currentScroll >=
        maxScroll - 1;

      /* ========================================
         SCROLL RIGHT
      ======================================== */

      if (delta > 0) {
        /*
         * We reached the right edge.
         */
        if (atEnd) {
          /*
           * There are still products available.
           *
           * Prevent vertical page scrolling.
           * Load the next 4.
           */
          if (
            visibleCount <
            products.length
          ) {
            event.preventDefault();

            loadMore(true);

            return;
          }

          /*
           * ALL PRODUCTS ARE LOADED.
           *
           * Do NOT call preventDefault().
           *
           * The browser can now continue
           * normal vertical page scrolling.
           */
          return;
        }

        /*
         * Horizontal scrolling is still possible.
         *
         * Stop vertical page movement.
         */
        event.preventDefault();

        /*
         * Move exactly according to the wheel
         * delta, similar to Shift + wheel.
         */
        container.scrollLeft += delta;

        return;
      }

      /* ========================================
         SCROLL LEFT
      ======================================== */

      if (delta < 0) {
        /*
         * At the absolute left edge.
         *
         * Allow normal page scrolling upward.
         */
        if (atStart) {
          return;
        }

        /*
         * Horizontal scrolling is possible.
         */
        event.preventDefault();

        container.scrollLeft += delta;
      }
    };

    /*
     * IMPORTANT:
     *
     * passive:false is required so that
     * event.preventDefault() can stop the
     * browser's normal vertical scrolling.
     */
    container.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      container.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, [
    products.length,
    visibleCount,
    loadMore,
  ]);

  /* ==========================================
     CLOSE SORT DROPDOWN OUTSIDE CLICK
  ========================================== */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(
          event.target as Node
        )
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <section
      id="shop"
      className="
        mx-auto
        w-[calc(100%-28px)]
        max-w-[1720px]
        py-12
        sm:py-16
      "
    >
      {/* ========================================
          SECTION HEADER
      ======================================== */}

      <div
        className="
          mb-7
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        {/* Title */}

        <div>
          <span
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.12em]
              text-zinc-500
            "
          >
            Selected for you
          </span>

          <h2
            className="
              mt-2
              text-2xl
              font-black
              tracking-[-0.045em]
              sm:text-3xl
            "
          >
            {query
              ? `Results for "${query}"`
              : activeCategory === "All"
                ? "Trending right now"
                : activeCategory}
          </h2>
        </div>

        {/* Controls */}

        <div className="flex items-center justify-between gap-5">
          {/* Sort */}

          <div
            ref={sortRef}
            className="relative z-30"
          >
            <label
              className="sr-only"
              htmlFor="sort-products"
            >
              Sort products
            </label>

            <button
              id="sort-products"
              type="button"
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
              onClick={() =>
                setIsSortOpen(
                  (open) => !open
                )
              }
              className="
                flex
                h-11
                min-w-[190px]
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-zinc-200
                bg-white/90
                px-3.5
                pr-3
                text-sm
                font-medium
                text-zinc-700
                shadow-[0_8px_20px_rgba(15,23,42,0.06)]
                outline-none
                transition
                duration-200
                hover:border-zinc-300
                hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)]
                focus:border-zinc-400
                focus:ring-2
                focus:ring-zinc-200
              "
            >
              <span className="truncate">
                {sortBy}
              </span>

              <ChevronDown
                size={14}
                className={`
                  shrink-0
                  text-zinc-500
                  transition-transform
                  duration-200
                  ${
                    isSortOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* Sort menu */}

            {isSortOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-[60]
                  w-[220px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-white/95
                  p-2
                  shadow-[0_18px_40px_rgba(15,23,42,0.12)]
                  backdrop-blur-sm
                "
              >
                {sortOptions.map(
                  (option) => {
                    const isSelected =
                      option === sortBy;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(
                            false
                          );
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          transition
                          ${
                            isSelected
                              ? "bg-zinc-950 text-white shadow-sm"
                              : "bg-transparent text-zinc-700 hover:bg-zinc-100"
                          }
                        `}
                      >
                        <span>
                          {option}
                        </span>

                        {isSelected && (
                          <span
                            className="
                              h-2.5
                              w-2.5
                              rounded-full
                              bg-white
                            "
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* View all */}

          <a
            href="#shop"
            className="
              ml-auto
              flex
              items-center
              gap-2
              text-sm
              font-extrabold
              text-zinc-600
              transition
              hover:text-zinc-950
            "
          >
            View all

            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* ========================================
          PRODUCTS
      ======================================== */}

      {products.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="
            flex
            w-full
            gap-0
            overflow-x-auto
            overflow-y-hidden
            pb-5
            sm:gap-0.5
            scrollbar-hide
            overscroll-x-contain
          "
        >
          {/* ======================================
              VISIBLE PRODUCT CARDS
          ====================================== */}

          {visibleProducts.map(
            (product) => (
              <div
                key={product.id}
                className="
                  w-[calc(50vw-23px)]
                  min-w-[calc(50vw-23px)]
                  shrink-0
                  sm:w-[calc((100vw-80px)/3)]
                  sm:min-w-[250px]
                  lg:w-[calc((100%-60px)/6)]
                  lg:min-w-[250px]
                "
              >
                <ProductCard
                  product={product}
                  quantity={0}
                  onQuantityChange={(
                    nextQuantity
                  ) =>
                    onCartQuantityChange(
                      product.id,
                      nextQuantity
                    )
                  }
                  onToggleWishlist={(
                    isActive
                  ) =>
                    onToggleWishlist(
                      product.id,
                      isActive
                    )
                  }
                />
              </div>
            )
          )}

          {/* ======================================
              VIEW MORE CARD
          ====================================== */}

          {hasMoreProducts && (
            <button
              type="button"
              onClick={() =>
                loadMore(false)
              }
              className="
                group
                flex
                min-h-[312px]
                min-w-[152px]
                shrink-0
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-zinc-200
                bg-white/80
                px-5
                text-center
                transition-all
                duration-300
                hover:border-zinc-950
                hover:bg-white
                hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)]
              "
            >
              {/* Arrow */}

              <span
                className="
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-zinc-950
                  text-white
                  transition-all
                  duration-300
                  group-hover:scale-110
                "
              >
                <ArrowRight
                  size={20}
                />
              </span>

              <span
                className="
                  text-xs
                  font-extrabold
                  text-zinc-950
                "
              >
                View more
              </span>

              <span
                className="
                  mt-2
                  text-[10px]
                  text-zinc-500
                "
              >
                {products.length -
                  visibleCount}{" "}
                products more
              </span>

            
            </button>
          )}
        </div>
      ) : (
        <EmptyProductState
          setQuery={setQuery}
          setActiveCategory={
            setActiveCategory
          }
        />
      )}

      {/* ========================================
          SCROLL INFORMATION
      ======================================== */}

      {products.length > 0 && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            text-[10px]
            font-medium
            text-zinc-400
          "
        >
          <span>
            Showing{" "}
            {Math.min(
              visibleCount,
              products.length
            )}{" "}
            of {products.length}
          </span>

          {hasMoreProducts ? (
            <span className="hidden sm:block">
              Scroll over products to explore →
            </span>
          ) : (
            <span className="hidden sm:block">
              Continue scrolling to explore ↓
            </span>
          )}
        </div>
      )}
    </section>
  );
}