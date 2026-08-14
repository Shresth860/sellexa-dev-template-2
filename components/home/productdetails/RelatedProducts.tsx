import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/data/product";

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 w-[calc(100%-28px)] max-w-[1720px] pb-20">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-zinc-500">
            You may also like
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-zinc-950">
            More picks for you
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
