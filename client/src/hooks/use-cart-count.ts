import { useEffect, useState } from "react";

import { CART_STORAGE_KEY, getStoredCartCount, setStoredCartCount } from "@/store/cart-store";

export function useCartCount() {
  const [count, setCountState] = useState(() => getStoredCartCount());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        setCountState(getStoredCartCount());
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setCount = (nextCount: number) => {
    const normalized = nextCount < 0 ? 0 : nextCount;
    setCountState(normalized);
    setStoredCartCount(normalized);
  };

  return { count, setCount };
}
