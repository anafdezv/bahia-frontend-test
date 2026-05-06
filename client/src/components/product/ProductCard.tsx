import { Link } from "react-router-dom";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceFromCents } from "@/lib/price";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const hoverImage = product.otherMediaUrl?.find(
    (imageUrl) => Boolean(imageUrl) && imageUrl !== product.mediaUrl
  );

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-none border-0 bg-transparent py-0 shadow-none">
      <Link
        to={`/products/${product.id}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={product.mediaUrl}
            alt={product.name}
            className="absolute inset-0 h-full w-full rounded-none object-cover"
            loading="lazy"
          />
          {hoverImage ? (
            <img
              src={hoverImage}
              alt={`${product.name} alternate`}
              className="absolute inset-0 h-full w-full rounded-none object-cover opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              loading="lazy"
            />
          ) : null}
        </div>
      </Link>
      <CardHeader className="gap-2 px-0 pt-4 pb-0">
        <CardTitle className="line-clamp-2 text-[clamp(1rem,0.92rem+0.22vw,1.2rem)] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#141414] uppercase">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardFooter className="mt-auto px-0 pt-3 pb-0">
        <span className="text-[clamp(1.12rem,1.03rem+0.25vw,1.3rem)] font-semibold tracking-[-0.01em] text-[#121212]">
          {formatPriceFromCents(product.price)}
        </span>
      </CardFooter>
    </Card>
  );
}
