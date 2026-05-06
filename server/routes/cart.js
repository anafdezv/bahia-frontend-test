import { Router } from "express";

export const cartRouter = Router();

function parsePositiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

cartRouter.post("/", (req, res) => {
  const { id, size, total } = req.body ?? {};
  const parsedId = parsePositiveInteger(id);
  const parsedTotal = parsePositiveInteger(total);

  if (parsedId === null) {
    res.status(400).json({ code: "INVALID_CART_PRODUCT_ID", message: "Invalid id value" });
    return;
  }

  if (typeof size !== "string" || size.trim().length === 0) {
    res.status(400).json({ code: "INVALID_SIZE", message: "Invalid size value" });
    return;
  }

  if (parsedTotal === null) {
    res.status(400).json({ code: "INVALID_TOTAL", message: "Invalid total value" });
    return;
  }

  res.json({ count: parsedTotal });
});
