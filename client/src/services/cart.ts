import { apiPost } from "@/services/api";

type AddToCartPayload = {
  id: number;
  size: string;
  total: number;
};

type AddToCartResponse = {
  count: number;
};

export async function addToCart(payload: AddToCartPayload) {
  return apiPost<AddToCartResponse, AddToCartPayload>("/cart", payload);
}
