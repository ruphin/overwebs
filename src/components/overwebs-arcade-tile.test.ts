import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ARCADE_ACCENT, OverwebsArcadeTile, arcadeTileImage } from "./overwebs-arcade-tile.js";
import { playTileAccent } from "./overwebs-play-tile.js";

beforeAll(() => {
  customElements.define("test-overwebs-arcade-tile", OverwebsArcadeTile);
});

async function create(setup: (tile: OverwebsArcadeTile) => void = () => {}) {
  const tile = document.createElement("test-overwebs-arcade-tile") as OverwebsArcadeTile;
  setup(tile);
  document.body.append(tile);
  await tile.updateComplete;
  return tile;
}

const root = (tile: OverwebsArcadeTile) => tile.shadowRoot!;

afterEach(() => {
  document.body.replaceChildren();
});

describe("overwebs-arcade-tile", () => {
  it("sets the background from the mode", async () => {
    expect(arcadeTileImage("all-brawls")).toBe("/arcade/allBrawls.png");
    const tile = await create((tile) => {
      tile.mode = "elimination";
    });
    expect(root(tile).querySelector(".tile")!.getAttribute("style")).toContain(
      "url(/arcade/elimination.png)",
    );
    tile.mode = "no-limits";
    await tile.updateComplete;
    expect(root(tile).querySelector(".tile")!.getAttribute("style")).toContain(
      "url(/arcade/noLimits.png)",
    );
  });

  it("renders the size and heading", async () => {
    const tile = await create((tile) => {
      tile.size = "1v1";
      tile.heading = "Mystery Duel";
    });
    expect(root(tile).querySelector(".size")!.textContent).toBe("1v1");
    expect(root(tile).querySelector(".heading")!.textContent).toBe("Mystery Duel");
  });

  it("fills one segment per popularity point", async () => {
    const tile = await create();
    for (const popularity of [0, 1, 2, 3, 4]) {
      tile.popularity = popularity;
      await tile.updateComplete;
      expect(root(tile).querySelectorAll(".segment")).toHaveLength(5);
      expect(root(tile).querySelectorAll(".segment.filled")).toHaveLength(popularity);
      expect(root(tile).querySelector(".most")).toBeNull();
    }
  });

  it("shows Most Popular at popularity 5", async () => {
    const tile = await create((tile) => {
      tile.popularity = 5;
    });
    expect(root(tile).querySelectorAll(".segment")).toHaveLength(0);
    expect(root(tile).querySelector(".most")!.textContent).toBe("Most Popular");
  });

  it("clamps out of range popularity", async () => {
    const tile = await create((tile) => {
      tile.popularity = -3;
    });
    expect(root(tile).querySelectorAll(".segment.filled")).toHaveLength(0);
    tile.popularity = 9;
    await tile.updateComplete;
    expect(root(tile).querySelector(".most")).not.toBeNull();
  });

  it("reflects big", async () => {
    const tile = await create();
    expect(tile.hasAttribute("big")).toBe(false);
    tile.big = true;
    await tile.updateComplete;
    expect(tile.hasAttribute("big")).toBe(true);
  });

  it("dispatches a queue event in the arcade accent when clicked with a queue type", async () => {
    expect(ARCADE_ACCENT).toBe(playTileAccent("arcade"));
    const listener = vi.fn<(event: CustomEvent<{ type: string; accent: string }>) => void>();
    document.addEventListener("queue", listener);
    (await create()).click();
    expect(listener).not.toHaveBeenCalled();
    const tile = await create((tile) => {
      tile.mode = "elimination";
      tile.queue = "Elimination";
    });
    tile.click();
    document.removeEventListener("queue", listener);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]![0].detail).toEqual({
      type: "Elimination",
      accent: ARCADE_ACCENT,
    });
  });
});
