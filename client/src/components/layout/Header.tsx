import { ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useCartCount } from "@/hooks/use-cart-count";
import { Button } from "@/components/ui/button";
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
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-2 px-6 pt-5 pb-2 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/products" className="text-lg font-extrabold tracking-[-0.02em] text-[#171717]">
            Bahia Store
          </Link>
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-[104px] gap-2 rounded-full border-[#222] bg-white px-4 text-sm font-semibold text-[#111] shadow-none hover:bg-[#f5f5f5]"
          >
            <ShoppingBag className="size-3.5" />
            Cart ({count})
          </Button>
        </div>

        <Breadcrumb>
          <BreadcrumbList className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#666]">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products" className="hover:text-[#1a1a1a]">
                  Products
                </Link>
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
