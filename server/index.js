import cors from "cors";
import express from "express";

import { cartRouter } from "./routes/cart.js";
import { productRouter } from "./routes/product.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
