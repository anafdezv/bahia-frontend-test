import cors from "cors";
import express from "express";

import { cartRouter } from "./routes/cart.js";
import { productRouter } from "./routes/product.js";

function buildErrorPayload(error, status) {
  if (error?.type === "entity.parse.failed") {
    return { code: "INVALID_JSON", message: "Invalid JSON payload" };
  }

  if (status >= 500) {
    return { code: "INTERNAL_ERROR", message: "Internal server error" };
  }

  return {
    code: typeof error?.code === "string" ? error.code : "BAD_REQUEST",
    message: typeof error?.message === "string" && error.message.trim().length > 0 ? error.message : "Unexpected error"
  };
}

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
    res.status(status).json(buildErrorPayload(error, status));
  });

  return app;
}
