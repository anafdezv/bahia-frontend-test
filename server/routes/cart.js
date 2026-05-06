import { Router } from "express";

export const cartRouter = Router();

let count = 0;

cartRouter.post("/", (req, res) => {
  const { total } = req.body ?? {};
  const parsed = Number(total);

  if (!Number.isInteger(parsed) || parsed < 1) {
    res.status(400).json({ message: "Invalid total value" });
    return;
  }

  count += parsed;

  res.json({ count });
});
