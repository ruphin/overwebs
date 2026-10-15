import { afterEach, describe, expect, it } from "vitest";
import "../elements/overwebs-main-page.js";
import { selectBackgrounds } from "../lib/backgrounds.js";
import { defaultPlayer, player, type Player } from "../lib/player.js";
import type { OverwebsMainPage } from "./overwebs-main-page.js";

const create = async (setup?: (element: OverwebsMainPage) => void): Promise<OverwebsMainPage> => {
  const element = document.createElement("overwebs-main-page");
  setup?.(element);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const tracer = selectBackgrounds("hollywood/tracer");

describe("overwebs-main-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    player.set(defaultPlayer);
  });

  it("renders the player widget and the menu items", async () => {
    const element = await create();
    const root = element.shadowRoot!;
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    const menu = root.querySelector("overwebs-main-menu")!;
    expect(menu.items.map(({ label, href, primary }) => [label, href, !!primary])).toEqual([
      ["Play", "/play", true],
      ["Training", "/training", true],
      ["Hero Gallery", "/hero-gallery", true],
      ["Options", "/options", false],
      ["Exit Game", "/exit", false],
    ]);
    await menu.updateComplete;
    expect(menu.shadowRoot!.querySelectorAll(".main-menu a")).toHaveLength(3);
    expect(menu.shadowRoot!.querySelectorAll(".sub-menu a")).toHaveLength(2);
  });

  it("shows the hero name and unlocks of the selection", async () => {
    const element = await create((el) => {
      el.selection = tracer;
    });
    const root = element.shadowRoot!;
    for (const selector of [".name", ".nameShadow", ".nameShadow2"]) {
      expect(root.querySelector(selector)?.textContent).toBe("Tracer");
    }
    expect(root.querySelector(".unlocks")?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "27/74 unlocks",
    );
    expect(root.querySelector(".unlocks .unlocked")?.textContent).toBe("27");
  });

  it("caps unlocks at the unlockable count and follows the player store", async () => {
    const element = await create((el) => {
      el.selection = tracer;
    });
    const rich: Player = { ...defaultPlayer, unlocks: { tracer: 100 } };
    player.set(rich);
    await element.updateComplete;
    expect(element.player).toBe(rich);
    expect(element.shadowRoot!.querySelector(".unlocks .unlocked")?.textContent).toBe("74");

    player.set({ ...defaultPlayer, unlocks: {} });
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector(".unlocks .unlocked")?.textContent).toBe("0");
  });

  it("renders an empty hero block without a selection", async () => {
    const element = await create();
    const root = element.shadowRoot!;
    expect(root.querySelector(".name")?.textContent).toBe("");
    expect(root.querySelector(".unlocks .unlocked")?.textContent).toBe("0");
  });
});
