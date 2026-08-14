"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/home/ProductCard";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/product";

export default function SearchResultsPage() {
  const router = useRouter();
  const { cartCount, wishlistCount } = useCart();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (searchParams.get("category") ?? "All").trim();
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    setSearchInput(searchParams.get("q") ?? "");
    setSelectedCategory(searchParams.get("category") ?? "All");
  }, [searchParams]);

  const handleSearchSubmit = () => {
    const nextQuery = searchInput.trim();
    const params = new URLSearchParams();

    if (nextQuery) {
      params.set("q", nextQuery);
    }

    if (selectedCategory && selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryChange = (nextCategory: string) => {
    setSelectedCategory(nextCategory);

    const params = new URLSearchParams();

    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    }

    if (nextCategory && nextCategory !== "All") {
      params.set("category", nextCategory);
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        category === "All" ||
        product.category.toLowerCase() === category.toLowerCase();

      if (!normalizedQuery) {
        return categoryMatch;
      }

      const searchable = [
        product.name,
        product.category,
        product.badge || "",
        ...(product.keywords || []),
        String(product.price),
        String(product.oldPrice || ""),
        String(product.rating),
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatch && searchable.includes(normalizedQuery);
    });
  }, [query, category]);

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-zinc-900">
      <Header
        query={searchInput}
        setQuery={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        products={products}
        setActiveCategory={handleCategoryChange}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px] pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Search results</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-zinc-950">
              {query
                ? `Results for “${query}”`
                : category === "All"
                  ? "All products"
                  : `${category} products`}
            </h1>
          </div>

          <div className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700">
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => router.push(`/product/${product.id}`)} className="cursor-pointer">
                <ProductCard
                  product={product}
                  quantity={0}
                  onQuantityChange={() => {}}
                  onToggleWishlist={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600">
            No products match your search criteria.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
