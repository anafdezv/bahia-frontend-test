import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useCartCount } from "@/hooks/use-cart-count";
import { getErrorMessage } from "@/services/api";
import { addToCart } from "@/services/cart";
import type { Product } from "@/types/product";

type AddToCartFormProps = {
  product: Product;
};

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { setCount } = useCartCount();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedTotal, setSelectedTotal] = useState("1");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSize("");
    setSelectedTotal("1");
    setAddError(null);
    setAddSuccess(null);
    setIsAdding(false);
  }, [product.id]);

  async function handleAddToCart() {
    if (!selectedSize) {
      setAddError("Selecciona una talla.");
      return;
    }

    try {
      setIsAdding(true);
      setAddError(null);
      setAddSuccess(null);

      const response = await addToCart({
        id: product.id,
        size: selectedSize,
        total: Number(selectedTotal)
      });

      setCount((currentCount) => currentCount + response.count);
      setAddSuccess("Producto añadido al carrito.");
    } catch (submitError) {
      setAddError(getErrorMessage(submitError, "No se pudo añadir el producto."));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <>
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
    </>
  );
}
