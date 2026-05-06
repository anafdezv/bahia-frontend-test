import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
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
    <main className="mx-auto flex min-h-[calc(100svh-140px)] w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Product List</h1>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by reference, name or description"
          aria-label="Search products"
          className="max-w-md"
        />
      </section>

      {error ? <p className="text-sm text-destructive">Error loading products: {error}</p> : null}

      {isLoading ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
