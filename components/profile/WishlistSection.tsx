"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products as allProducts, type Product } from "@/data/product";

export function WishlistSection({
  triggerToast,
}: {
  triggerToast: (msg: string) => void;
}) {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();

  const wishlistedProducts = useMemo(() => {
    const savedIds = Object.keys(wishlistItems)
      .map(Number)
      .filter((id) => wishlistItems[id]);

    if (savedIds.length === 0) {
      return allProducts.slice(0, 4);
    }

    return allProducts.filter((p) => wishlistItems[p.id]);
  }, [wishlistItems]);

  const handleRemove = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, false);
    triggerToast(`Removed "${product.name}" from your wishlist`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    triggerToast(`Added "${product.name}" to your cart!`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-r from-white via-white to-[#fffaf4] rounded-[24px] p-5 sm:p-6 border border-zinc-200/90 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-950">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Items saved for later. Move them to your cart when you are ready to purchase.
          </p>
        </div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-[24px] p-12 border border-zinc-200/90 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fde8e1] text-[#d8566f] border border-[#fbd0c6] flex items-center justify-center mb-4 shadow-sm">
            <Heart className="w-8 h-8 fill-[#d8566f]/20 text-[#d8566f]" />
          </div>
          <h3 className="text-lg font-bold text-zinc-950">Your wishlist is empty</h3>
          <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6 font-medium">
            Explore our collections and tap the heart icon to save products you love for later.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#171a18] text-white font-bold text-sm hover:bg-zinc-800 transition shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistedProducts.map((product) => {
            const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price);

            return (
              <div
                key={product.id}
                className="bg-white rounded-[24px] border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all flex flex-col overflow-hidden group"
              >
                <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleRemove(product, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-[#d8566f] hover:bg-[#fde8e1] transition-all shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.badge && (
                    <span className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-[#171a18] text-white px-2.5 py-1 rounded-lg shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-zinc-400 text-[11px] font-normal">({product.reviews})</span>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
                      className="block text-sm font-bold text-zinc-950 hover:text-[#d77d3c] transition-colors line-clamp-2 mt-1 leading-snug"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-black text-zinc-950">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-zinc-400 line-through font-medium">
                          ₹{product.oldPrice?.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full h-10 rounded-xl bg-[#f5f6f3] hover:bg-[#171a18] text-zinc-900 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] border border-zinc-200/80 hover:border-[#171a18]"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#d77d3c]" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
