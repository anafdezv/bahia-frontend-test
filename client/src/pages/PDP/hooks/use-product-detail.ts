import { useEffect, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { getProductById } from "@/services/products";
import type { Product } from "@/types/product";

type UseProductDetailResult = {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
};

export function useProductDetail(id: string | undefined): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productId = Number(id);
    if (!Number.isFinite(productId)) {
      setProduct(null);
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
          setError(null);
        }
      } catch (loadError) {
        if (mounted) {
          setProduct(null);
          setError(getErrorMessage(loadError, "No se pudo cargar el producto."));
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

  return { product, isLoading, error };
}
