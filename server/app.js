import cors from "cors";
import express from "express";

import { cartRouter } from "./routes/cart.js";
import { productRouter } from "./routes/product.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/product", productRouter);
  app.use("/api/cart", cartRouter);

  app.use((error, _req, res, next) => {
    void next;
    const status = Number.isInteger(error?.status) ? error.status : 500;
    const isServerError = status >= 500;

    res.status(status).json({
      message: isServerError ? "Internal server error" : (error?.message ?? "Unexpected error")
    });
  });

  return app;
}
