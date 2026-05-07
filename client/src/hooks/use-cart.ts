import { useEffect, useMemo, useState } from "react";

import {
  CART_COUNT_SYNC_EVENT,
  CART_ITEMS_STORAGE_KEY,
  type CartItem,
  getStoredCartItems,
  setStoredCartItems
} from "@/store/cart-store";

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity: number;
};

function mergeCartItems(items: CartItem[], incoming: AddCartItemInput) {
  const normalizedQuantity = Number(incoming.quantity);
  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
    return items;
  }

  const nextItems = [...items];
  const index = nextItems.findIndex(
    (item) => item.productId === incoming.productId && item.size === incoming.size
  );

  if (index === -1) {
    nextItems.push({
      ...incoming,
      quantity: normalizedQuantity
    });
    return nextItems;
  }

  const current = nextItems[index];
  nextItems[index] = {
    ...current,
    quantity: current.quantity + normalizedQuantity
  };

  return nextItems;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => getStoredCartItems());

  useEffect(() => {
    const syncFromStorage = () => {
      setItems(getStoredCartItems());
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_ITEMS_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    const onCartSync = (event: Event) => {
      const detail = (event as CustomEvent<CartItem[]>).detail;
      if (Array.isArray(detail)) {
        setItems(detail);
        return;
      }
      syncFromStorage();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_COUNT_SYNC_EVENT, onCartSync);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_COUNT_SYNC_EVENT, onCartSync);
    };
  }, []);

  const persistItems = (updater: (currentItems: CartItem[]) => CartItem[]) => {
    const currentItems = getStoredCartItems();
    const nextItems = updater(currentItems);
    setStoredCartItems(nextItems);
    setItems(nextItems);
  };

  const addItem = (item: AddCartItemInput) => {
    persistItems((currentItems) => mergeCartItems(currentItems, item));
  };

  const updateItemQuantity = (productId: number, size: string, quantity: number) => {
    persistItems((currentItems) => {
      const normalized = Number(quantity);
      if (!Number.isInteger(normalized)) {
        return currentItems;
      }

      if (normalized <= 0) {
        return currentItems.filter((item) => !(item.productId === productId && item.size === size));
      }

      return currentItems.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity: normalized } : item
      );
    });
  };

  const removeItem = (productId: number, size: string) => {
    persistItems((currentItems) =>
      currentItems.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const clearCart = () => {
    persistItems(() => []);
  };

  const count = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const totalPriceCents = useMemo(
    () => items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0),
    [items]
  );

  return {
    items,
    count,
    totalPriceCents,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
  };
}
