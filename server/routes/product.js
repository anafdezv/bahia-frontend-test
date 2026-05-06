import { Router } from "express";

import { createProductsRepository } from "../data/products-repository.js";

const productsRepository = createProductsRepository();

function parseProductId(rawId) {
  const parsedId = Number(rawId);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    return null;
  }

  return parsedId;
}

export function createProductRouter(repository = productsRepository) {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const products = await repository.getAll();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = parseProductId(req.params.id);

      if (id === null) {
        res.status(400).json({ code: "INVALID_PRODUCT_ID", message: "Invalid id value" });
        return;
      }

      const product = await repository.getById(id);

      if (!product) {
        res.status(404).json({ code: "PRODUCT_NOT_FOUND", message: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export const productRouter = createProductRouter();
