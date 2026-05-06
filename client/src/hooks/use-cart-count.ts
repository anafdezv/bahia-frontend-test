import { useEffect, useState } from "react";

import {
  CART_COUNT_SYNC_EVENT,
  CART_STORAGE_KEY,
  getStoredCartCount,
  setStoredCartCount
} from "@/store/cart-store";

export function useCartCount() {
  const [count, setCountState] = useState(() => getStoredCartCount());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        setCountState(getStoredCartCount());
      }
    };

    const onCartSync = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      setCountState(typeof detail === "number" ? detail : getStoredCartCount());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_COUNT_SYNC_EVENT, onCartSync);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_COUNT_SYNC_EVENT, onCartSync);
    };
  }, []);

  const setCount = (nextCount: number) => {
    const normalized = nextCount < 0 ? 0 : nextCount;
    setCountState(normalized);
    setStoredCartCount(normalized);
  };

  return { count, setCount };
}
