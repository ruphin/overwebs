import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { OverwebsLoadingSpinner } from "./overwebs-loading-spinner.js";

const create = async (
  setup?: (element: OverwebsLoadingSpinner) => void,
): Promise<OverwebsLoadingSpinner> => {
  const element = document.createElement("test-overwebs-loading-spinner") as OverwebsLoadingSpinner;
  setup?.(element);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-loading-spinner", () => {
  beforeAll(() => {
    customElements.define("test-overwebs-loading-spinner", OverwebsLoadingSpinner);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders seven hexagons with staggered animation delays", async () => {
    const element = await create();
    const paths = [...element.shadowRoot!.querySelectorAll("path")];
    expect(paths).toHaveLength(7);
    expect(paths.map((path) => path.getAttribute("style"))).toEqual(
      [0, 150, 300, 450, 600, 750, 900].map((delay) => `animation-delay: ${delay}ms`),
    );
    const d = paths[0]!.getAttribute("d");
    expect(paths.every((path) => path.getAttribute("d") === d)).toBe(true);
  });

  it("sizes the svg in design pixels", async () => {
    const element = await create();
    const svg = element.shadowRoot!.querySelector("svg")!;
    expect(element.size).toBe(52);
    expect(svg.getAttribute("style")).toBe(
      "width: calc(52 * var(--u)); height: calc(52 * var(--u))",
    );

    element.size = 50;
    await element.updateComplete;
    expect(svg.getAttribute("style")).toBe(
      "width: calc(50 * var(--u)); height: calc(50 * var(--u))",
    );
  });

  it("reflects the white flag", async () => {
    const element = await create();
    expect(element.hasAttribute("white")).toBe(false);
    element.white = true;
    await element.updateComplete;
    expect(element.hasAttribute("white")).toBe(true);
  });

  it("reads the white attribute", async () => {
    const element = await create((el) => el.setAttribute("white", ""));
    expect(element.white).toBe(true);
  });
});
