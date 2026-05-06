import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden bg-white">
      <Skeleton className="aspect-[3/4] w-full rounded-none bg-[#dfdfdf]" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-7/12 bg-[#e2e2e2]" />
        <Skeleton className="h-5 w-10/12 bg-[#e2e2e2]" />
        <Skeleton className="h-6 w-4/12 bg-[#e2e2e2]" />
      </div>
    </div>
  );
}

function matchesSearch(product: Product, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [product.reference, product.name, product.description]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

export default function PLPPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts();
        if (mounted) {
          setProducts(response);
          setError(null);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unexpected error");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => matchesSearch(product, query));
  }, [products, query]);

  return (
    <main className="mx-auto flex min-h-[calc(100svh-90px)] w-full max-w-[1760px] flex-col gap-8 px-7 pb-10 sm:px-8 lg:px-10">
      <section className="grid grid-cols-1 items-end gap-4 pt-1 lg:grid-cols-[1fr_auto]">
        <h1 className="text-[clamp(1.9rem,1.55rem+0.9vw,2.6rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-[#141414]">
          Product List
        </h1>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by reference, name or description"
          aria-label="Search products"
          className="h-12 w-full rounded-xl border-[#d7d7d7] bg-white px-5 text-[1rem] font-medium text-[#202020] placeholder:font-medium placeholder:text-[#8b8b8b] lg:w-[560px]"
        />
      </section>

      {error ? <p className="text-sm text-destructive">Error loading products: {error}</p> : null}

      {isLoading ? (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}

      {!isLoading && !error && filteredProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products match your search.</p>
      ) : null}
    </main>
  );
}
