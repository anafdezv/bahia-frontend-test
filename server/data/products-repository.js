import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProductsFilePath = path.resolve(__dirname, "../../products.json");

function createProductsDataError(message) {
  const error = new Error(message);
  error.status = 500;
  return error;
}

export function createProductsRepository(options = {}) {
  const productsFilePath = options.productsFilePath ?? defaultProductsFilePath;

  let cachedProducts = null;
  let cachedMtimeMs = null;

  async function refreshCacheIfNeeded() {
    const fileStats = await stat(productsFilePath);

    if (cachedProducts && cachedMtimeMs === fileStats.mtimeMs) {
      return;
    }

    const raw = await readFile(productsFilePath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw createProductsDataError("Products data must be an array");
    }

    cachedProducts = parsed;
    cachedMtimeMs = fileStats.mtimeMs;
  }

  return {
    async getAll() {
      await refreshCacheIfNeeded();
      return cachedProducts;
    },
    async getById(id) {
      await refreshCacheIfNeeded();
      const products = cachedProducts;
      return products.find((item) => item.id === id) ?? null;
    }
  };
}
