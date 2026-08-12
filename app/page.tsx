"use client";

import { useMemo, useState } from "react";

import AnnouncementBar from "@/components/home/AnnouncementBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import SellexaDifference from "@/components/home/SellexaDifference";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/home/Footer";

import { products } from "@/data/product";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [wishlistItems, setWishlistItems] = useState<Record<number, boolean>>({});
  const [sortBy, setSortBy] = useState("Popular");

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

  const cartCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  const wishlistCount = Object.keys(wishlistItems).length;

  const handleCartQuantityChange = (productId: number, nextQuantity: number) => {
    setCartItems((prev) => {
      const currentQuantity = prev[productId] ?? 0;
      if (nextQuantity <= 0) {
        if (!currentQuantity) return prev;
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      if (currentQuantity === nextQuantity) return prev;

      return {
        ...prev,
        [productId]: nextQuantity,
      };
    });
  };

  const handleToggleWishlist = (productId: number, isActive: boolean) => {
    setWishlistItems((prev) => {
      const next = { ...prev };

      if (isActive) {
        next[productId] = true;
      } else {
        delete next[productId];
      }

      return next;
    });
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
        wishlistCount={wishlistCount}
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