"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";

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

  const {
    cartCount,
    wishlistCount,
  } = useCart();

  const {
    searchQuery,
    setSearchQuery,
  } = useSearch();

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Popular");

  /*
   * SEARCH
   */
  const handleSearchSubmit = () => {
    const term = searchQuery.trim();

    if (!term) {
      router.push(
        "/search?category=All"
      );
      return;
    }

    const exactCategory =
      categories.find(
        (category) =>
          category.toLowerCase() ===
            term.toLowerCase() ||
          category
            .toLowerCase()
            .includes(term.toLowerCase())
      ) ?? "All";

    router.push(
      `/search?q=${encodeURIComponent(
        term
      )}&category=${encodeURIComponent(
        exactCategory
      )}`
    );
  };

  /*
   * FILTER + SORT
   */
  const sortedProducts = useMemo(() => {
    const nextProducts =
      products.filter(
        (product) =>
          activeCategory === "All" ||
          product.category.toLowerCase() ===
            activeCategory.toLowerCase()
      );

    switch (sortBy) {
      case "Price: Low to High":
        return [...nextProducts].sort(
          (a, b) => a.price - b.price
        );

      case "Price: High to Low":
        return [...nextProducts].sort(
          (a, b) => b.price - a.price
        );

      case "Newest":
        return [...nextProducts].sort(
          (a, b) => b.id - a.id
        );

      case "Popular":
      default:
        return [...nextProducts].sort(
          (a, b) =>
            b.rating * b.reviews -
            a.rating * a.reviews
        );
    }
  }, [
    activeCategory,
    sortBy,
  ]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-[#171918]">

      <AnnouncementBar />

      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Categories */}
      <Categories
        activeCategory={activeCategory}
        setActiveCategory={
          setActiveCategory
        }
      />

      {/* Products */}
      <ProductSection
        products={sortedProducts}
        query={searchQuery}
        activeCategory={activeCategory}
        setQuery={setSearchQuery}
        setActiveCategory={
          setActiveCategory
        }
        sortBy={sortBy}
        setSortBy={setSortBy}
        onCartQuantityChange={() => {}}
        onToggleWishlist={() => {}}
      />

      {/* Sellexa Difference */}
      <SellexaDifference />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />

    </main>
  );
}