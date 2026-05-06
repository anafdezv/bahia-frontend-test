import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import App from "@/App";

describe("App", () => {
  it("renders header and routes to products", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText("Listado de productos")).toBeInTheDocument();
    expect(screen.getByText("Bahia Store")).toBeInTheDocument();
  });
});
