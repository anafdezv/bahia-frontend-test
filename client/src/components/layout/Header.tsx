import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPriceFromCents } from "@/lib/price";
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
    return "Productos";
  }

  if (pathname.startsWith("/products/")) {
    return "Detalle de producto";
  }

  return "Inicio";
}

export default function Header() {
  const location = useLocation();
  const { items, count, totalPriceCents, updateItemQuantity, removeItem, clearCart } = useCart();
  const currentLabel = routeLabel(location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const onClickOutside = (event: MouseEvent) => {
      if (!cartRef.current?.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isCartOpen]);

  return (
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-6 pt-5 pb-2 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/products" className="text-lg font-extrabold tracking-[-0.02em] text-[#171717]">
            Bahia Store
          </Link>
          <div className="relative" ref={cartRef}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCartOpen((current) => !current)}
              aria-expanded={isCartOpen}
              aria-haspopup="dialog"
              className="h-10 min-w-[104px] gap-2 rounded-full border-[#222] bg-white px-4 text-sm font-semibold text-[#111] shadow-none hover:bg-[#f5f5f5]"
            >
              <ShoppingBag className="size-3.5" />
              Carrito ({count})
            </Button>

            {isCartOpen ? (
              <div className="absolute top-12 right-0 z-50 w-[min(92vw,430px)] rounded-xl border border-[#dedede] bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold tracking-[-0.01em] text-[#111]">Carrito</p>
                  <p className="text-xs font-semibold text-[#666]">{count} artículo(s)</p>
                </div>

                {items.length === 0 ? (
                  <p className="py-2 text-sm text-[#6d6d6d]">Tu carrito está vacío.</p>
                ) : (
                  <>
                    <ul className="max-h-[360px] space-y-3 overflow-auto pr-1">
                      {items.map((item) => {
                        const lineTotal = item.unitPriceCents * item.quantity;

                        return (
                          <li
                            key={`${item.productId}-${item.size}`}
                            className="rounded-lg border border-[#ececec] p-3"
                          >
                            <div className="flex gap-3">
                              <img
                                src={item.mediaUrl}
                                alt={item.name}
                                className="h-16 w-12 flex-none rounded-sm object-cover"
                                loading="lazy"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold tracking-[0.04em] text-[#6f6f6f] uppercase">
                                  {item.reference}
                                </p>
                                <p className="line-clamp-2 text-sm font-semibold text-[#1a1a1a]">{item.name}</p>
                                <p className="mt-1 text-xs text-[#5d5d5d]">Talla: {item.size}</p>
                                <p className="mt-1 text-xs text-[#5d5d5d]">
                                  {formatPriceFromCents(item.unitPriceCents)} x {item.quantity} ={" "}
                                  <span className="font-semibold text-[#161616]">
                                    {formatPriceFromCents(lineTotal)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateItemQuantity(item.productId, item.size, item.quantity - 1)
                                  }
                                  className="h-7 w-7 px-0"
                                >
                                  -
                                </Button>
                                <span className="min-w-5 text-center text-sm font-semibold">{item.quantity}</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateItemQuantity(item.productId, item.size, item.quantity + 1)
                                  }
                                  className="h-7 w-7 px-0"
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeItem(item.productId, item.size)}
                                className="h-7 px-2 text-xs text-[#6a6a6a] hover:text-[#111]"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-4 border-t border-[#eaeaea] pt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#111]">Total</p>
                        <p className="text-sm font-extrabold text-[#111]">
                          {formatPriceFromCents(totalPriceCents)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={clearCart}
                        className="h-8 w-full border-[#d8d8d8] text-xs font-semibold text-[#222]"
                      >
                        Vaciar carrito
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <Breadcrumb>
          <BreadcrumbList className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#666]">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products" className="hover:text-[#1a1a1a]">
                  Productos
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
