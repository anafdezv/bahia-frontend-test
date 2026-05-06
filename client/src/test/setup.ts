import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => void 0;
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => void 0;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => void 0;
}
