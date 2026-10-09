import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-play-page.js";
import type { OverwebsPageTitle } from "./overwebs-page-title.js";
import type { OverwebsPlayPage } from "./overwebs-play-page.js";
import type { OverwebsPlayTile } from "./overwebs-play-tile.js";

const mount = async (): Promise<OverwebsPlayPage> => {
  const element = document.createElement("overwebs-play-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const tiles = (element: OverwebsPlayPage) =>
  [...element.shadowRoot!.querySelectorAll<OverwebsPlayTile>("overwebs-play-tile")].map((tile) => ({
    mode: tile.mode,
    heading: tile.heading,
    info: tile.info,
    href: tile.closest("a")?.getAttribute("href") ?? null,
  }));

describe("overwebs-play-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("renders the title, player widget and back button", async () => {
    const root = (await mount()).shadowRoot!;
    expect(root.querySelector<OverwebsPageTitle>("overwebs-page-title")!.text).toBe("Play");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(root.querySelector("overwebs-global-button")!.getAttribute("action")).toBe("back");
  });

  it("renders the five play modes with their links", async () => {
    expect(tiles(await mount())).toEqual([
      { mode: "quick-play", heading: "Quick Play", info: false, href: null },
      { mode: "arcade", heading: "Arcade", info: false, href: "/arcade" },
      { mode: "competitive-play", heading: "Competitive Play", info: true, href: "/competitive" },
      { mode: "play-vs-ai", heading: "Play vs. AI", info: false, href: "/vs-ai" },
      { mode: "custom-game", heading: "Custom Game", info: false, href: null },
    ]);
  });

  it("copies the legacy descriptions", async () => {
    const tile = (await mount()).shadowRoot!.querySelector<OverwebsPlayTile>("overwebs-play-tile")!;
    expect(tile.description).toBe("Jump into a game against other players of your skill level.");
  });

  it("dispatches a bubbling, composed queue event when Quick Play is clicked", async () => {
    const element = await mount();
    const listener = vi.fn<(event: CustomEvent<{ type: string }>) => void>();
    document.addEventListener("queue", listener);
    element.shadowRoot!.querySelector<OverwebsPlayTile>("overwebs-play-tile")!.click();
    document.removeEventListener("queue", listener);

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0];
    expect(event.detail).toEqual({ type: "Quick Play" });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("does not queue from the other tiles", async () => {
    const element = await mount();
    const listener = vi.fn();
    document.addEventListener("queue", listener);
    const all = element.shadowRoot!.querySelectorAll<OverwebsPlayTile>("overwebs-play-tile");
    all[4]!.click();
    document.removeEventListener("queue", listener);
    expect(listener).not.toHaveBeenCalled();
  });

  it("goes back when the back button is clicked", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const element = await mount();
    element.shadowRoot!.querySelector<HTMLElement>("overwebs-global-button")!.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
