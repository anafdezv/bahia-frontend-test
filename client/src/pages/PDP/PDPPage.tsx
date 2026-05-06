import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPriceFromCents } from "@/lib/price";
import { AddToCartForm } from "@/pages/PDP/components/AddToCartForm";
import { ProductGallery } from "@/pages/PDP/components/ProductGallery";
import { useProductDetail } from "@/pages/PDP/hooks/use-product-detail";

function ProductDetailSkeleton() {
  return (
    <main className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-[1440px] grid-cols-1 gap-8 px-7 py-6 sm:px-8 lg:grid-cols-[minmax(0,720px)_minmax(0,520px)] lg:justify-center lg:gap-12 lg:px-10">
      <section className="w-full max-w-[720px] space-y-4">
        <Skeleton className="aspect-[3/4] w-full bg-[#ebebeb]" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full bg-[#ececec]" />
          ))}
        </div>
      </section>
      <section className="w-full max-w-[520px] space-y-5 lg:justify-self-center">
        <Skeleton className="h-5 w-1/3 bg-[#ececec]" />
        <Skeleton className="h-12 w-10/12 bg-[#ececec]" />
        <Skeleton className="h-24 w-full bg-[#ececec]" />
        <Skeleton className="h-10 w-1/4 bg-[#ececec]" />
      </section>
    </main>
  );
}

export default function PDPPage() {
  const { id } = useParams();
  const { product, isLoading, error } = useProductDetail(id);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex min-h-[calc(100svh-100px)] w-full max-w-[1440px] flex-col gap-4 px-7 py-6 sm:px-8 lg:px-10">
        <p className="text-sm text-destructive">Error cargando producto: {error ?? "No encontrado"}</p>
        <Button asChild variant="outline" className="w-fit">
          <Link to="/products">Volver a productos</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[calc(100svh-100px)] w-full max-w-[1440px] grid-cols-1 gap-8 px-7 py-6 sm:px-8 lg:grid-cols-[minmax(0,720px)_minmax(0,520px)] lg:justify-center lg:gap-12 lg:px-10">
      <ProductGallery product={product} />

      <section className="w-full max-w-[520px] justify-self-center py-1">
        <div className="flex flex-col gap-6">
          <Button asChild variant="outline" className="w-fit border-[#d6d6d6] bg-white text-[#141414] shadow-none">
            <Link to="/products">Volver a productos</Link>
          </Button>

          <p className="text-xs font-semibold tracking-[0.06em] text-[#6a6a6a] uppercase">{product.reference}</p>
          <h1 className="text-[clamp(1.45rem,1.2rem+0.7vw,2.1rem)] leading-[1.05] font-extrabold tracking-[-0.02em] uppercase text-[#151515]">
            {product.name}
          </h1>
          <p className="max-w-2xl text-[1rem] leading-[1.45] text-[#666]">{product.description}</p>
          <p className="text-[clamp(1.35rem,1.22rem+0.32vw,1.6rem)] font-semibold text-[#111]">
            {formatPriceFromCents(product.price)}
          </p>

          <AddToCartForm product={product} />
        </div>
      </section>
    </main>
  );
}
