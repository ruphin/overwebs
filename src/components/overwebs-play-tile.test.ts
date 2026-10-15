import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { vi } from "vitest";
import {
  OverwebsPlayTile,
  playTileAccent,
  playTileAccents,
  playTileIcon,
  playTileImage,
  playTileImages,
  type PlayMode,
} from "./overwebs-play-tile.js";

beforeAll(() => {
  customElements.define("test-overwebs-play-tile", OverwebsPlayTile);
});

async function create(setup: (tile: OverwebsPlayTile) => void = () => {}) {
  const tile = document.createElement("test-overwebs-play-tile") as OverwebsPlayTile;
  setup(tile);
  document.body.append(tile);
  await tile.updateComplete;
  return tile;
}

const $ = (tile: OverwebsPlayTile, selector: string) =>
  tile.shadowRoot!.querySelector<HTMLElement>(selector)!;

afterEach(() => {
  document.body.replaceChildren();
});

describe("overwebs-play-tile", () => {
  it("maps every mode to its artwork", () => {
    expect(playTileImages["quick-play"]).toBe("quickPlay");
    expect(playTileImages["easy-ai"]).toBe("easyAI");
    expect(playTileImage("competitive-play")).toBe("/tiles/competitivePlay.png");
    expect(playTileIcon("practice-range")).toBe("/tiles/icon-practiceRange.png");
    for (const mode of ["easy-ai", "medium-ai", "hard-ai"] satisfies PlayMode[]) {
      expect(playTileIcon(mode)).toBeUndefined();
    }
  });

  it("sets the background and icon from the mode", async () => {
    const tile = await create((tile) => {
      tile.mode = "arcade";
    });
    expect($(tile, ".tile").getAttribute("style")).toContain("url(/tiles/arcade.png)");
    expect($(tile, ".icon").getAttribute("style")).toContain("url(/tiles/icon-arcade.png)");

    tile.mode = "hard-ai";
    await tile.updateComplete;
    expect($(tile, ".tile").getAttribute("style")).toContain("url(/tiles/hardAI.png)");
    expect($(tile, ".icon").getAttribute("style")).toBe("");
  });

  it("renders the heading and description", async () => {
    const tile = await create((tile) => {
      tile.heading = "Quick Play";
      tile.description = "Jump into a game.";
    });
    expect($(tile, ".heading").textContent).toBe("Quick Play");
    expect($(tile, ".description").textContent).toBe("Jump into a game.");

    tile.heading = "Arcade";
    await tile.updateComplete;
    expect($(tile, ".heading").textContent).toBe("Arcade");
  });

  it("reflects info and reads it from the attribute", async () => {
    const tile = await create();
    expect(tile.hasAttribute("info")).toBe(false);
    tile.info = true;
    await tile.updateComplete;
    expect(tile.hasAttribute("info")).toBe(true);

    const fromAttribute = await create((tile) => tile.setAttribute("info", ""));
    expect(fromAttribute.info).toBe(true);
  });

  it("has an accent colour for every mode", () => {
    for (const mode of Object.keys(playTileImages) as PlayMode[]) {
      expect(playTileAccent(mode)).toMatch(/^#[0-9a-f]{6}$/);
    }
    expect(playTileAccents["easy-ai"]).toBe(playTileAccents["play-vs-ai"]);
  });

  it("dispatches a queue event in its accent when clicked with a queue type, else nothing", async () => {
    const listener = vi.fn<(event: CustomEvent<{ type: string; accent: string }>) => void>();
    document.addEventListener("queue", listener);
    const silent = await create((tile) => (tile.mode = "arcade"));
    silent.click();
    expect(listener).not.toHaveBeenCalled();
    const tile = await create((tile) => {
      tile.mode = "tutorial";
      tile.queue = "Tutorial";
    });
    tile.click();
    document.removeEventListener("queue", listener);
    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0];
    expect(event.detail).toEqual({ type: "Tutorial", accent: playTileAccent("tutorial") });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });
});
