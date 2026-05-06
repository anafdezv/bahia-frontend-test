export const CART_STORAGE_KEY = "bahia:cart:count";
export const CART_COUNT_SYNC_EVENT = "bahia:cart-count-sync";

export function getStoredCartCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function setStoredCartCount(count: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, String(count));
  window.dispatchEvent(new CustomEvent<number>(CART_COUNT_SYNC_EVENT, { detail: count }));
}
