import { apiGet } from "@/services/api";
import type { Product } from "@/types/product";

export async function getProducts() {
  return apiGet<Product[]>("/product");
}
