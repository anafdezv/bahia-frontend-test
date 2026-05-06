import { readFile } from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.resolve(__dirname, "../../products.json");

async function loadProducts() {
  const raw = await readFile(productsPath, "utf8");
  return JSON.parse(raw);
}

export const productRouter = Router();

productRouter.get("/", async (_req, res, next) => {
  try {
    const products = await loadProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const products = await loadProducts();
    const product = products.find((item) => item.id === id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});
