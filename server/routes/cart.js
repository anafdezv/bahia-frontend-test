import { Router } from "express";

export const cartRouter = Router();

cartRouter.post("/", (req, res) => {
  const { id, size, total } = req.body ?? {};
  const parsedId = Number(id);
  const parsed = Number(total);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    res.status(400).json({ message: "Invalid id value" });
    return;
  }

  if (typeof size !== "string" || size.trim().length === 0) {
    res.status(400).json({ message: "Invalid size value" });
    return;
  }

  if (!Number.isInteger(parsed) || parsed < 1) {
    res.status(400).json({ message: "Invalid total value" });
    return;
  }

  res.json({ count: parsed });
});
