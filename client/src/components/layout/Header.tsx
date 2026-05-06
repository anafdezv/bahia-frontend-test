import { ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useCartCount } from "@/hooks/use-cart-count";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

function routeLabel(pathname: string) {
  if (pathname === "/products") {
    return "Products";
  }

  if (pathname.startsWith("/products/")) {
    return "Product detail";
  }

  return "Home";
}

export default function Header() {
  const location = useLocation();
  const { count } = useCartCount();
  const currentLabel = routeLabel(location.pathname);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link to="/products" className="text-lg font-semibold tracking-tight">
            Bahia Store
          </Link>
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <ShoppingBag className="size-3.5" />
            {count}
          </Badge>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== "/products" ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
