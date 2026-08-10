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

      return searchMatch && (search ? true : categoryMatch);
    });
  }, [query, activeCategory]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f6f3] text-[#171918]">
      <AnnouncementBar />

      <Header
        query={query}
        setQuery={setQuery}
        products={products}
        setActiveCategory={setActiveCategory}
      />

      <Hero />

      <Categories
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <ProductSection
        products={filteredProducts}
        query={query}
        activeCategory={activeCategory}
        setQuery={setQuery}
        setActiveCategory={setActiveCategory}
      />

      <SellexaDifference />

      <Newsletter />

      <Footer />
    </main>
  );
}