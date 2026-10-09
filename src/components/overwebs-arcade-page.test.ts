import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-arcade-page.js";
import type { OverwebsArcadePage } from "./overwebs-arcade-page.js";
import type { OverwebsArcadeTile } from "./overwebs-arcade-tile.js";

const create = async (): Promise<OverwebsArcadePage> => {
  const element = document.createElement("overwebs-arcade-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-arcade-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("renders the Arcade title and the player widget", async () => {
    const root = (await create()).shadowRoot!;
    expect(root.querySelector("overwebs-page-title")!.text).toBe("Arcade");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
  });

  it("renders the five arcade tiles", async () => {
    const root = (await create()).shadowRoot!;
    const tiles = [...root.querySelectorAll<OverwebsArcadeTile>(".modes overwebs-arcade-tile")];
    expect(
      tiles.map(({ mode, heading, size, popularity, big }) => ({
        mode,
        heading,
        size,
        popularity,
        big,
      })),
    ).toEqual([
      { mode: "mystery-duel", heading: "Mystery Duel", size: "1v1", popularity: 1, big: true },
      { mode: "elimination", heading: "Elimination", size: "3v3", popularity: 5, big: false },
      { mode: "mystery-heroes", heading: "Mystery Heroes", size: "6v6", popularity: 0, big: false },
      { mode: "all-brawls", heading: "All Brawls!", size: "6v6", popularity: 2, big: false },
      { mode: "no-limits", heading: "No Limits", size: "6v6", popularity: 2, big: false },
    ]);
    expect(tiles[0]!.hasAttribute("big")).toBe(true);
  });

  it("staggers the tile fade-in", async () => {
    const root = (await create()).shadowRoot!;
    const delays = [...root.querySelectorAll<HTMLElement>("overwebs-arcade-tile")].map(
      (tile) => tile.style.animationDelay,
    );
    expect(delays).toEqual(["0ms", "50ms", "100ms", "150ms", "200ms"]);
  });

  it("goes back when the back button is clicked", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const root = (await create()).shadowRoot!;
    const button = root.querySelector("overwebs-global-button")!;
    expect(button.action).toBe("back");
    button.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
