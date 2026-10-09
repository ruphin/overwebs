import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-training-page.js";
import type { OverwebsPageTitle } from "./overwebs-page-title.js";
import type { OverwebsPlayTile } from "./overwebs-play-tile.js";
import type { OverwebsTrainingPage } from "./overwebs-training-page.js";

const mount = async (): Promise<OverwebsTrainingPage> => {
  const element = document.createElement("overwebs-training-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-training-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("renders the title, player widget and back button", async () => {
    const root = (await mount()).shadowRoot!;
    expect(root.querySelector<OverwebsPageTitle>("overwebs-page-title")!.text).toBe("Training");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(root.querySelector("overwebs-global-button")!.getAttribute("action")).toBe("back");
  });

  it("renders the training modes with their links", async () => {
    const root = (await mount()).shadowRoot!;
    const tiles = [...root.querySelectorAll<OverwebsPlayTile>("overwebs-play-tile")].map(
      (tile) => ({
        mode: tile.mode,
        heading: tile.heading,
        description: tile.description,
        href: tile.closest("a")?.getAttribute("href") ?? null,
      }),
    );
    expect(tiles).toEqual([
      {
        mode: "tutorial",
        heading: "Tutorial",
        description: "Learn the basics of Overwatch.",
        href: null,
      },
      {
        mode: "practice-range",
        heading: "Practice Range",
        description: "Practice using your weapons and abilities.",
        href: null,
      },
      {
        mode: "play-vs-ai",
        heading: "Practice vs. AI",
        description: "Hone your skill by playing against AI-controlled heroes.",
        href: "/vs-ai",
      },
    ]);
  });

  it("goes back when the back button is clicked", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const element = await mount();
    element.shadowRoot!.querySelector<HTMLElement>("overwebs-global-button")!.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
