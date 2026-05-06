import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartCount } from "@/hooks/use-cart-count";
import { formatPriceFromCents } from "@/lib/price";
import { addToCart } from "@/services/cart";
import { getProductById } from "@/services/products";
import type { Product } from "@/types/product";

function uniqueMedia(product: Product) {
  return Array.from(
    new Set([product.mediaUrl, ...(product.otherMediaUrl ?? []), ...(product.otherMediaUrls ?? [])].filter(Boolean))
  );
}

export default function PDPPage() {
  const { id } = useParams();
  const { setCount } = useCartCount();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedTotal, setSelectedTotal] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productId = Number(id);
    if (!Number.isFinite(productId)) {
      setError("ID de producto no válido");
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
          setIsZoomed(false);
          setZoomOrigin("50% 50%");
          setSelectedSize("");
          setSelectedTotal("1");
          setAddError(null);
          setAddSuccess(null);
          setError(null);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Error inesperado");
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

  function handleMainImageClick() {
    setIsZoomed((prev) => !prev);
    if (isZoomed) {
      setZoomOrigin("50% 50%");
    }
  }

  function handleMainImageMove(event: MouseEvent<HTMLButtonElement>) {
    if (!isZoomed) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    if (!selectedSize) {
      setAddError("Selecciona una talla.");
      return;
    }

    try {
      setIsAdding(true);
      setAddError(null);
      setAddSuccess(null);

      const payload = {
        id: product.id,
        size: selectedSize,
        total: Number(selectedTotal)
      };
      const response = await addToCart(payload);

      setCount(response.count);
      setAddSuccess("Producto añadido al carrito.");
    } catch (submitError) {
      setAddError(submitError instanceof Error ? submitError.message : "No se pudo añadir el producto.");
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
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
      <section className="w-full max-w-[720px] space-y-4 lg:flex lg:h-[calc(100svh-150px)] lg:max-h-[calc(100svh-150px)] lg:flex-col lg:overflow-hidden">
        <button
          type="button"
          className={`aspect-[3/4] w-full overflow-hidden bg-[#f0f0f0] lg:min-h-0 lg:flex-1 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={handleMainImageClick}
          onMouseMove={handleMainImageMove}
          aria-label={isZoomed ? "Desactivar zoom de imagen" : "Activar zoom de imagen"}
        >
          <img
            src={activeImage}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-200 ${
              isZoomed ? "scale-[2.2]" : "scale-100"
            }`}
            style={{ transformOrigin: zoomOrigin }}
          />
        </button>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:flex-none">
          {media.map((mediaUrl) => (
            <button
              key={mediaUrl}
              type="button"
              onClick={() => {
                setSelectedImage(mediaUrl);
                setIsZoomed(false);
                setZoomOrigin("50% 50%");
              }}
              className={`aspect-square w-full overflow-hidden bg-[#f2f2f2] ${
                activeImage === mediaUrl ? "border-2 border-black" : "border border-[#e3e3e3]"
              }`}
              aria-label="Seleccionar imagen del producto"
            >
              <img src={mediaUrl} alt={`${product.name} thumbnail`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

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

        <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-[0.06em] text-[#686868] uppercase">Talla</p>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full border-[#d8d8d8] bg-white shadow-none">
                <SelectValue placeholder="Seleccionar talla" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-[0.06em] text-[#686868] uppercase">Cantidad</p>
            <Select value={selectedTotal} onValueChange={setSelectedTotal}>
              <SelectTrigger className="w-full border-[#d8d8d8] bg-white shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }).map((_, index) => {
                  const value = String(index + 1);
                  return (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || product.sizes.length === 0}
            className="mt-2 w-full bg-[#111] text-white hover:bg-[#222]"
          >
            {isAdding ? "Añadiendo..." : "Añadir"}
          </Button>
          {addError ? <p className="text-sm text-destructive">{addError}</p> : null}
          {addSuccess ? <p className="text-sm text-[#2f6f38]">{addSuccess}</p> : null}
        </div>
        </div>
      </section>
    </main>
  );
}
