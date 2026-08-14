"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import SellexaDifference from "@/components/home/SellexaDifference";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/home/Footer";

import { categories, products } from "@/data/product";

export default function Home() {
  const router = useRouter();
  const { cartCount, wishlistCount } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");

  const handleSearchSubmit = () => {
    const term = searchInput.trim();
    const exactCategory =
      categories.find(
        (category) =>
          category.toLowerCase() === term.toLowerCase() ||
          category.toLowerCase().includes(term.toLowerCase())
      ) ?? "All";

    setSearchInput("");

    if (!term) {
      router.push("/search?category=All");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(term)}&category=${encodeURIComponent(exactCategory)}`
    );
  };

  const sortedProducts = useMemo(() => {
    const nextProducts = products.filter(
      (product) =>
        activeCategory === "All" ||
        product.category.toLowerCase() === activeCategory.toLowerCase()
    );

    switch (sortBy) {
      case "Price: Low to High":
        return [...nextProducts].sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return [...nextProducts].sort((a, b) => b.price - a.price);
      case "Newest":
        return [...nextProducts].sort((a, b) => b.id - a.id);
      case "Popular":
      default:
        return [...nextProducts].sort(
          (a, b) => b.rating * b.reviews - a.rating * a.reviews
        );
    }
  }, [activeCategory, sortBy]);

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
        query={searchInput}
        setQuery={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
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
        query=""
        activeCategory={activeCategory}
        setQuery={setSearchInput}
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