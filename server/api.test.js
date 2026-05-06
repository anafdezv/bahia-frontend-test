import assert from "node:assert/strict";
import test from "node:test";

import { createApp } from "./app.js";

let server;
let baseUrl;

test.before(async () => {
  const app = createApp();

  await new Promise((resolve, reject) => {
    server = app.listen(0, "127.0.0.1");
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  if (!server || !server.listening) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test("GET /api/health returns API health", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("GET /api/product/:id returns 404 for unknown ids", async () => {
  const response = await fetch(`${baseUrl}/api/product/999999999`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { message: "Product not found" });
});

test("GET /api/product/:id validates id format", async () => {
  const response = await fetch(`${baseUrl}/api/product/abc`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { message: "Invalid id value" });
});

test("POST /api/cart validates payload and returns count", async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: "abc", size: "", total: 0 })
  });
  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(await invalidResponse.json(), { message: "Invalid id value" });

  const validResponse = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 10, size: "M", total: 3 })
  });
  assert.equal(validResponse.status, 200);
  assert.deepEqual(await validResponse.json(), { count: 3 });
});

test("POST /api/cart validates size and total edge cases", async () => {
  const invalidSizeResponse = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 10, size: " ", total: 1 })
  });
  assert.equal(invalidSizeResponse.status, 400);
  assert.deepEqual(await invalidSizeResponse.json(), { message: "Invalid size value" });

  const invalidTotalResponse = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 10, size: "M", total: 0 })
  });
  assert.equal(invalidTotalResponse.status, 400);
  assert.deepEqual(await invalidTotalResponse.json(), { message: "Invalid total value" });
});

test("API returns JSON response for malformed payload errors", async () => {
  const response = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{"
  });

  assert.equal(response.status, 400);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
  const body = await response.json();
  assert.equal(typeof body.message, "string");
});
