import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-vs-ai-page.js";
import type { OverwebsPageTitle } from "./overwebs-page-title.js";
import type { OverwebsPlayTile } from "./overwebs-play-tile.js";
import type { OverwebsVsAiPage } from "./overwebs-vs-ai-page.js";

const mount = async (): Promise<OverwebsVsAiPage> => {
  const element = document.createElement("overwebs-vs-ai-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-vs-ai-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("renders the title, player widget and back button", async () => {
    const root = (await mount()).shadowRoot!;
    expect(root.querySelector<OverwebsPageTitle>("overwebs-page-title")!.text).toBe("VS. AI");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(root.querySelector("overwebs-global-button")!.getAttribute("action")).toBe("back");
  });

  it("renders the three difficulties without links", async () => {
    const root = (await mount()).shadowRoot!;
    const tiles = [...root.querySelectorAll<OverwebsPlayTile>("overwebs-play-tile")].map(
      (tile) => ({ mode: tile.mode, heading: tile.heading, description: tile.description }),
    );
    expect(tiles).toEqual([
      {
        mode: "easy-ai",
        heading: "Easy",
        description: "Play against easy difficulty AI-controlled heroes.",
      },
      {
        mode: "medium-ai",
        heading: "Medium",
        description: "Play against medium difficulty AI-controlled heroes.",
      },
      {
        mode: "hard-ai",
        heading: "Hard",
        description: "Play against hard difficulty AI-controlled heroes.",
      },
    ]);
    expect(root.querySelector("a")).toBeNull();
  });

  it("goes back when the back button is clicked", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const element = await mount();
    element.shadowRoot!.querySelector<HTMLElement>("overwebs-global-button")!.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
