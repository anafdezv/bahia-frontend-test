import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PLPPage from "@/pages/PLP/PLPPage";

const mockedProducts = [
  {
    id: 1,
    reference: "REF001",
    name: "Basic Tee",
    description: "Soft cotton t-shirt",
    mediaUrl: "https://example.com/tee.jpg",
    otherMediaUrl: [],
    sizes: ["S", "M"],
    price: 1999
  },
  {
    id: 2,
    reference: "REF002",
    name: "Denim Jacket",
    description: "Classic blue denim",
    mediaUrl: "https://example.com/jacket.jpg",
    otherMediaUrl: [],
    sizes: ["M", "L"],
    price: 6599
  }
];

describe("PLPPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders products from API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockedProducts
    } as Response);

    render(
      <MemoryRouter>
        <PLPPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Basic Tee")).toBeInTheDocument();
    expect(screen.getByText("Denim Jacket")).toBeInTheDocument();
  });

  it("filters products by search query", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockedProducts
    } as Response);

    render(
      <MemoryRouter>
        <PLPPage />
      </MemoryRouter>
    );

    await screen.findByText("Basic Tee");

    const searchInput = screen.getByRole("textbox", { name: /buscar productos/i });
    await userEvent.type(searchInput, "denim");

    expect(screen.queryByText("Basic Tee")).not.toBeInTheDocument();
    expect(screen.getByText("Denim Jacket")).toBeInTheDocument();
  });

  it("renders backend error message from typed API errors", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        code: "SERVICE_UNAVAILABLE",
        message: "Servicio temporalmente no disponible"
      })
    } as Response);

    render(
      <MemoryRouter>
        <PLPPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Error cargando productos: Servicio temporalmente no disponible")
    ).toBeInTheDocument();
  });
});
