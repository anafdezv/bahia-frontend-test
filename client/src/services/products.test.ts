import { beforeEach, describe, expect, it, vi } from "vitest";

import { PRODUCTS_CACHE_TTL_MS, getProductById, getProducts } from "@/services/products";

const LIST_CACHE_KEY = "bahia:cache:products:list";
const DETAIL_CACHE_KEY = (id: number) => `bahia:cache:products:detail:${id}`;

describe("products service cache", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("caches product list responses for 1 hour", async () => {
    const payload = [{ id: 1, name: "A" }] as unknown as object;

    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => payload
    } as Response);

    const first = await getProducts();
    const second = await getProducts();

    expect(first).toEqual(payload);
    expect(second).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const rawCache = window.localStorage.getItem(LIST_CACHE_KEY);
    expect(rawCache).not.toBeNull();
    expect(rawCache).toContain("timestamp");
  });

  it("revalidates list cache when ttl expires", async () => {
    const stalePayload = [{ id: 1, name: "old" }];
    const freshPayload = [{ id: 1, name: "new" }];

    window.localStorage.setItem(
      LIST_CACHE_KEY,
      JSON.stringify({
        data: stalePayload,
        timestamp: Date.now() - PRODUCTS_CACHE_TTL_MS - 1
      })
    );

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => freshPayload
    } as Response);

    const result = await getProducts();

    expect(result).toEqual(freshPayload);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("stores and reads product detail cache per id", async () => {
    const detailPayload = { id: 42, name: "Detail" } as unknown as object;

    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => detailPayload
    } as Response);

    const first = await getProductById(42);
    const second = await getProductById(42);

    expect(first).toEqual(detailPayload);
    expect(second).toEqual(detailPayload);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const rawCache = window.localStorage.getItem(DETAIL_CACHE_KEY(42));
    expect(rawCache).not.toBeNull();
  });
});
