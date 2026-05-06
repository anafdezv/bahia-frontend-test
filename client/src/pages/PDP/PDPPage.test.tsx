import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PDPPage from "@/pages/PDP/PDPPage";

describe("PDPPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders product details from API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 10,
        reference: "REF010",
        name: "Vestido Mini",
        description: "Vestido de tirantes con espalda descubierta",
        mediaUrl: "https://example.com/1.jpg",
        otherMediaUrl: ["https://example.com/2.jpg"],
        sizes: ["S", "M"],
        price: 2999
      })
    } as Response);

    render(
      <MemoryRouter initialEntries={["/products/10"]}>
        <Routes>
          <Route path="/products/:id" element={<PDPPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Vestido Mini")).toBeInTheDocument();
    expect(screen.getByText("REF010")).toBeInTheDocument();
    expect(screen.getByText("Vestido de tirantes con espalda descubierta")).toBeInTheDocument();
    expect(screen.getByText(/29,99/)).toBeInTheDocument();
  });

  it("submits add-to-cart with selected size and quantity", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 10,
          reference: "REF010",
          name: "Vestido Mini",
          description: "Vestido de tirantes con espalda descubierta",
          mediaUrl: "https://example.com/1.jpg",
          otherMediaUrl: ["https://example.com/2.jpg"],
          sizes: ["S", "M"],
          price: 2999
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 2 })
      } as Response);

    render(
      <MemoryRouter initialEntries={["/products/10"]}>
        <Routes>
          <Route path="/products/:id" element={<PDPPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Vestido Mini");

    const user = userEvent.setup();
    const comboBoxes = screen.getAllByRole("combobox");

    await user.click(comboBoxes[0]);
    await user.click(screen.getByRole("option", { name: "M" }));

    await user.click(comboBoxes[1]);
    await user.click(screen.getByRole("option", { name: "2" }));

    await user.click(screen.getByRole("button", { name: "Añadir" }));

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/cart",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          id: 10,
          size: "M",
          total: 2
        })
      })
    );
    expect(await screen.findByText("Producto añadido al carrito.")).toBeInTheDocument();
  });

  it("renders backend error message when product detail request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        code: "PRODUCT_NOT_FOUND",
        message: "Product not found"
      })
    } as Response);

    render(
      <MemoryRouter initialEntries={["/products/999"]}>
        <Routes>
          <Route path="/products/:id" element={<PDPPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Error cargando producto: Product not found")).toBeInTheDocument();
  });

  it("renders backend error message when add-to-cart fails", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 10,
          reference: "REF010",
          name: "Vestido Mini",
          description: "Vestido de tirantes con espalda descubierta",
          mediaUrl: "https://example.com/1.jpg",
          otherMediaUrl: ["https://example.com/2.jpg"],
          sizes: ["S", "M"],
          price: 2999
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          code: "INVALID_SIZE",
          message: "Invalid size value"
        })
      } as Response);

    render(
      <MemoryRouter initialEntries={["/products/10"]}>
        <Routes>
          <Route path="/products/:id" element={<PDPPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText("Vestido Mini");

    const user = userEvent.setup();
    const comboBoxes = screen.getAllByRole("combobox");
    await user.click(comboBoxes[0]);
    await user.click(screen.getByRole("option", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "Añadir" }));

    expect(await screen.findByText("Invalid size value")).toBeInTheDocument();
  });
});
