import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createProductsRepository } from "./products-repository.js";

let tempDirectoryPath;

test.before(async () => {
  tempDirectoryPath = await mkdtemp(path.join(os.tmpdir(), "products-repository-test-"));
});

test.after(async () => {
  if (!tempDirectoryPath) {
    return;
  }

  await rm(tempDirectoryPath, { recursive: true, force: true });
});

test("repository returns products and can search by id", async () => {
  const productsFilePath = path.join(tempDirectoryPath, "products.json");
  const products = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
  await writeFile(productsFilePath, JSON.stringify(products), "utf8");

  const repository = createProductsRepository({ productsFilePath });

  assert.deepEqual(await repository.getAll(), products);
  assert.deepEqual(await repository.getById(2), { id: 2, name: "B" });
  assert.equal(await repository.getById(9), null);
});

test("repository refreshes cache when source file changes", async () => {
  const productsFilePath = path.join(tempDirectoryPath, "products-refresh.json");
  await writeFile(productsFilePath, JSON.stringify([{ id: 1 }]), "utf8");

  const repository = createProductsRepository({ productsFilePath });
  assert.deepEqual(await repository.getAll(), [{ id: 1 }]);

  await new Promise((resolve) => setTimeout(resolve, 15));
  await writeFile(productsFilePath, JSON.stringify([{ id: 1 }, { id: 2 }]), "utf8");

  assert.deepEqual(await repository.getAll(), [{ id: 1 }, { id: 2 }]);
});

test("repository throws when products payload is not an array", async () => {
  const productsFilePath = path.join(tempDirectoryPath, "products-invalid.json");
  await writeFile(productsFilePath, JSON.stringify({ id: 1 }), "utf8");

  const repository = createProductsRepository({ productsFilePath });
  await assert.rejects(() => repository.getAll(), {
    message: "Products data must be an array"
  });
});
