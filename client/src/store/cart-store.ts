export const CART_STORAGE_KEY = "bahia:cart:count";
export const CART_ITEMS_STORAGE_KEY = "bahia:cart:items";
export const CART_COUNT_SYNC_EVENT = "bahia:cart-count-sync";

export type CartItem = {
  productId: number;
  reference: string;
  name: string;
  size: string;
  unitPriceCents: number;
  quantity: number;
  mediaUrl: string;
};

function normalizeCartItems(items: CartItem[]) {
  return items
    .filter(
      (item) =>
        Number.isInteger(item.productId) &&
        item.productId > 0 &&
        typeof item.size === "string" &&
        item.size.trim().length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.unitPriceCents)
    )
    .map((item) => ({
      ...item,
      size: item.size.trim()
    }));
}

function countFromItems(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getStoredCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(CART_ITEMS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      window.localStorage.removeItem(CART_ITEMS_STORAGE_KEY);
      return [];
    }

    return normalizeCartItems(parsed as CartItem[]);
  } catch {
    window.localStorage.removeItem(CART_ITEMS_STORAGE_KEY);
    return [];
  }
}

export function getStoredCartCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  const items = getStoredCartItems();
  if (items.length > 0) {
    return countFromItems(items);
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function setStoredCartCount(count: number) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = Number.isFinite(count) && count >= 0 ? Math.floor(count) : 0;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, String(normalized));
    window.dispatchEvent(new CustomEvent<number>(CART_COUNT_SYNC_EVENT, { detail: normalized }));
  } catch {
    // Ignore storage write failures to avoid breaking UI flow.
  }
}

export function setStoredCartItems(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedItems = normalizeCartItems(items);
  const count = countFromItems(normalizedItems);

  try {
    window.localStorage.setItem(CART_ITEMS_STORAGE_KEY, JSON.stringify(normalizedItems));
    window.localStorage.setItem(CART_STORAGE_KEY, String(count));
    window.dispatchEvent(new CustomEvent<CartItem[]>(CART_COUNT_SYNC_EVENT, { detail: normalizedItems }));
  } catch {
    // Ignore storage write failures to avoid breaking UI flow.
  }
}
