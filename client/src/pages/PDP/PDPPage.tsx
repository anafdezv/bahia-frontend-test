import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceFromCents } from "@/lib/price";
import { getProductById } from "@/services/products";
import type { Product } from "@/types/product";

function uniqueMedia(product: Product) {
  return Array.from(
    new Set([product.mediaUrl, ...(product.otherMediaUrl ?? []), ...(product.otherMediaUrls ?? [])].filter(Boolean))
  );
}

export default function PDPPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productId = Number(id);
    if (!Number.isFinite(productId)) {
      setError("Invalid product id");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const response = await getProductById(productId);

        if (mounted) {
          setProduct(response);
          setSelectedImage(response.mediaUrl);
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

    void loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const media = useMemo(() => {
    if (!product) {
      return [];
    }
    return uniqueMedia(product);
  }, [product]);

  const activeImage = selectedImage || media[0] || "";

  if (isLoading) {
    return (
      <main className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-[1760px] grid-cols-1 gap-8 px-7 py-6 sm:px-8 lg:grid-cols-2 lg:px-10">
        <section className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full bg-[#ebebeb]" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full bg-[#ececec]" />
            ))}
          </div>
        </section>
        <section className="space-y-5">
          <Skeleton className="h-5 w-1/3 bg-[#ececec]" />
          <Skeleton className="h-12 w-10/12 bg-[#ececec]" />
          <Skeleton className="h-24 w-full bg-[#ececec]" />
          <Skeleton className="h-10 w-1/4 bg-[#ececec]" />
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-100px)] w-full max-w-[1760px] flex-col gap-4 px-7 py-6 sm:px-8 lg:px-10">
        <p className="text-sm text-destructive">Error loading product: {error ?? "Not found"}</p>
        <Button asChild variant="outline" className="w-fit">
          <Link to="/products">Back to products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-[1760px] grid-cols-1 gap-8 px-7 py-6 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10">
      <section className="space-y-4 lg:flex lg:h-[calc(100svh-150px)] lg:max-h-[calc(100svh-150px)] lg:flex-col lg:overflow-hidden">
        <div className="aspect-[3/4] w-full overflow-hidden bg-[#f0f0f0] lg:min-h-0 lg:flex-1">
          <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:flex-none">
          {media.map((mediaUrl) => (
            <button
              key={mediaUrl}
              type="button"
              onClick={() => setSelectedImage(mediaUrl)}
              className={`aspect-square w-full overflow-hidden bg-[#f2f2f2] ${
                activeImage === mediaUrl ? "ring-2 ring-black" : "ring-1 ring-[#e3e3e3]"
              }`}
              aria-label="Select product image"
            >
              <img src={mediaUrl} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 py-1">
        <Button asChild variant="outline" className="w-fit border-[#d6d6d6] bg-white text-[#141414] shadow-none">
          <Link to="/products">Back to products</Link>
        </Button>

        <p className="text-xs font-semibold tracking-[0.06em] text-[#6a6a6a] uppercase">{product.reference}</p>
        <h1 className="text-[clamp(1.45rem,1.2rem+0.7vw,2.1rem)] leading-[1.05] font-extrabold tracking-[-0.02em] uppercase text-[#151515]">
          {product.name}
        </h1>
        <p className="max-w-2xl text-[1rem] leading-[1.45] text-[#666]">{product.description}</p>
        <p className="text-[clamp(1.35rem,1.22rem+0.32vw,1.6rem)] font-semibold text-[#111]">
          {formatPriceFromCents(product.price)}
        </p>
      </section>
    </main>
  );
}
