import { describe, expect, it, vi } from "vitest";

import { ApiError, apiGet, apiPost, getErrorMessage } from "@/services/api";

describe("api service", () => {
  it("throws ApiError with backend message for JSON error responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ code: "PRODUCT_NOT_FOUND", message: "Product not found" })
    } as Response);

    await expect(apiGet("/product/999")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "PRODUCT_NOT_FOUND",
      message: "Product not found"
    });
  });

  it("falls back to status-based message when error response is not JSON", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ "content-type": "text/html" }),
      json: async () => ({})
    } as Response);

    await expect(apiPost("/cart", { id: 1 })).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: "Request failed (500)"
    });
  });

  it("normalizes unknown errors with fallback message", () => {
    expect(getErrorMessage(new Error("A"), "fallback")).toBe("A");
    expect(getErrorMessage({}, "fallback")).toBe("fallback");
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("exposes typed ApiError", () => {
    const error = new ApiError(401, "Unauthorized");
    expect(error.status).toBe(401);
    expect(error.message).toBe("Unauthorized");
    expect(error.name).toBe("ApiError");
  });
});
