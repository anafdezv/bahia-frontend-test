import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceFromCents } from "@/lib/price";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Link to={`/products/${product.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <img
          src={product.mediaUrl}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
      </Link>
      <CardHeader className="gap-2 px-4 pt-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-5">{product.name}</CardTitle>
          <Badge variant="outline">{product.reference}</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-3 pb-0 text-sm text-muted-foreground">
        <p className="line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="justify-between px-4 pt-4 pb-4">
        <span className="text-sm font-semibold">{formatPriceFromCents(product.price)}</span>
        <Link to={`/products/${product.id}`} className="text-sm text-primary underline-offset-4 hover:underline">
          View product
        </Link>
      </CardFooter>
    </Card>
  );
}
