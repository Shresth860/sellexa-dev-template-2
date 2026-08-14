"use client";

import Link from "next/link";

import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { products as allProducts, type Product } from "@/data/product";
import { useCart } from "@/context/CartContext";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";

type ProductDetailPageProps = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetailPage({
  product,
  relatedProducts,
}: ProductDetailPageProps) {
  const { cartCount } = useCart();

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-zinc-900">
      <Header
        query=""
        setQuery={() => {}}
        products={allProducts}
        setActiveCategory={() => {}}
        cartCount={cartCount}
        wishlistCount={0}
        showBackHome
        backHomeHref="/"
      />

      <section className="mx-auto mt-8 w-[calc(100%-28px)] max-w-[1720px]">
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link href="/#shop" className="transition hover:text-zinc-900">Shop</Link>
          <span>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="self-start xl:sticky xl:top-24">
            <ProductGallery product={product} />
          </div>
          <div className="self-start">
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />

      <Footer />
    </main>
  );
}
