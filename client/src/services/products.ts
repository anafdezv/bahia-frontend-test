import { apiGet } from "@/services/api";
import { readWithTtl, writeWithTimestamp } from "@/services/cache";
import type { Product } from "@/types/product";

export const PRODUCTS_CACHE_TTL_MS = 60 * 60 * 1000;
const PRODUCTS_LIST_CACHE_KEY = "bahia:cache:products:list";
const productDetailCacheKey = (id: number) => `bahia:cache:products:detail:${id}`;

type ProductsRequestOptions = {
  signal?: AbortSignal;
};

export async function getProducts(options: ProductsRequestOptions = {}) {
  const cachedProducts = readWithTtl<Product[]>(PRODUCTS_LIST_CACHE_KEY, PRODUCTS_CACHE_TTL_MS);

  if (cachedProducts) {
    return cachedProducts;
  }

  const products = await apiGet<Product[]>("/product", { signal: options.signal });
  writeWithTimestamp(PRODUCTS_LIST_CACHE_KEY, products);

  return products;
}

export async function getProductById(id: number, options: ProductsRequestOptions = {}) {
  const cacheKey = productDetailCacheKey(id);
  const cachedProduct = readWithTtl<Product>(cacheKey, PRODUCTS_CACHE_TTL_MS);

  if (cachedProduct) {
    return cachedProduct;
  }

  const product = await apiGet<Product>(`/product/${id}`, { signal: options.signal });
  writeWithTimestamp(cacheKey, product);

  return product;
}
