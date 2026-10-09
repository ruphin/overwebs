import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { OverwebsMainMenu, type MenuItem } from "./overwebs-main-menu.js";

const items: MenuItem[] = [
  { label: "Play", href: "/play", primary: true },
  { label: "Training", href: "/training", primary: true },
  { label: "Loot Box", href: "/loot", primary: true, disabled: true },
  { label: "Social", href: "/social" },
  { label: "Options", href: "/options" },
];

const create = async (value: MenuItem[]) => {
  const element = new OverwebsMainMenu();
  element.items = value;
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const anchors = (element: OverwebsMainMenu, list: string) => [
  ...element.shadowRoot!.querySelectorAll<HTMLAnchorElement>(`.${list} a`),
];

describe("overwebs-main-menu", () => {
  beforeAll(() => {
    customElements.define("test-overwebs-main-menu", OverwebsMainMenu);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders primary items in the main list and the rest in the sub list", async () => {
    const element = await create(items);
    expect(anchors(element, "main-menu").map((a) => a.textContent)).toEqual([
      "Play",
      "Training",
      "Loot Box",
    ]);
    expect(anchors(element, "sub-menu").map((a) => a.textContent)).toEqual(["Social", "Options"]);
  });

  it("links enabled items to their href", async () => {
    const element = await create(items);
    const [play, training] = anchors(element, "main-menu");
    expect(play?.getAttribute("href")).toBe("/play");
    expect(training?.getAttribute("href")).toBe("/training");
    expect(play?.hasAttribute("aria-disabled")).toBe(false);
    expect(anchors(element, "sub-menu").map((a) => a.getAttribute("href"))).toEqual([
      "/social",
      "/options",
    ]);
  });

  it("renders disabled items without href and with aria-disabled", async () => {
    const element = await create(items);
    const loot = anchors(element, "main-menu")[2];
    expect(loot?.hasAttribute("href")).toBe(false);
    expect(loot?.getAttribute("aria-disabled")).toBe("true");
  });

  it("updates when items change", async () => {
    const element = await create(items);
    element.items = [{ label: "Exit Game", href: "/exit" }];
    await element.updateComplete;
    expect(anchors(element, "main-menu")).toHaveLength(0);
    expect(anchors(element, "sub-menu").map((a) => a.getAttribute("href"))).toEqual(["/exit"]);
  });
});
