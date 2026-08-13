"use client";

import { useEffect, useMemo, useState } from "react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import SellexaDifference from "@/components/home/SellexaDifference";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/home/Footer";

import { products } from "@/data/product";
import { getCartCount } from "@/lib/cartCount";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());

    updateCount();
    window.addEventListener("sellexa-cart-count-changed", updateCount);

    return () => {
      window.removeEventListener("sellexa-cart-count-changed", updateCount);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        product.category.toLowerCase() ===
          activeCategory.toLowerCase();

      const normalizedValues = [
        product.name,
        product.category,
        product.badge || "",
        ...(product.keywords || []),
        String(product.price),
        String(product.oldPrice || ""),
        String(product.rating),
        String(product.reviews),
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch = !search || normalizedValues.includes(search);

      return searchMatch && categoryMatch;
    });
  }, [query, activeCategory]);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...filteredProducts];

    switch (sortBy) {
      case "Price: Low to High":
        return nextProducts.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return nextProducts.sort((a, b) => b.price - a.price);
      case "Newest":
        return nextProducts.sort((a, b) => b.id - a.id);
      case "Popular":
      default:
        return nextProducts.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    }
  }, [filteredProducts, sortBy]);

  const handleCartQuantityChange = (_productId: number, _nextQuantity: number) => {
    // cart logic removed
  };

  const handleToggleWishlist = (_productId: number, _isActive: boolean) => {
    // wishlist logic removed
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-[#171918]">
      <AnnouncementBar />

      <Header
        query={query}
        setQuery={setQuery}
        products={products}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        wishlistCount={0}
      />

      <Hero />

      <Categories
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <ProductSection
        products={sortedProducts}
        query={query}
        activeCategory={activeCategory}
        setQuery={setQuery}
        setActiveCategory={setActiveCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCartQuantityChange={handleCartQuantityChange}
        onToggleWishlist={handleToggleWishlist}
      />

      <SellexaDifference />

      <Newsletter />

      <Footer />
    </main>
  );
}