import { notFound } from "next/navigation";

import ProductDetailPage from "@/components/home/productdetails/ProductDetailPage";
import { products } from "@/data/product";

export default async function ProductDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 5);

  return (
    <ProductDetailPage
      product={product}
      relatedProducts={relatedProducts.length > 0 ? relatedProducts : products.filter((item) => item.id !== product.id).slice(0, 5)}
    />
  );
}
