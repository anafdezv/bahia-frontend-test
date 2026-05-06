import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import PDPPage from "@/pages/PDP/PDPPage";

describe("PDPPage", () => {
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
});
