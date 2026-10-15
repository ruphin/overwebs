import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-competitive-page.js";
import type { OverwebsCompetitivePage } from "./overwebs-competitive-page.js";
import { playTileAccent } from "./overwebs-play-tile.js";

const create = async (): Promise<OverwebsCompetitivePage> => {
  const element = document.createElement("overwebs-competitive-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const text = (node: Element | null | undefined): string =>
  (node?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("overwebs-competitive-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("renders the competitive column", async () => {
    const root = (await create()).shadowRoot!;
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(text(root.querySelector(".competitive .header"))).toBe("Competitive Play");
    expect(text(root.querySelector(".competitive .title"))).toBe("Season 3");
    expect(text(root.querySelector(".competitive .subtitle"))).toBe("Rewards");
    expect(root.querySelectorAll(".competitive .text")).toHaveLength(2);
    const rewards = root.querySelector(".competitive button.blue")!;
    expect(text(rewards)).toBe("Rewards");
    expect(rewards.querySelector("svg.i path")).not.toBeNull();
  });

  it("inlines the competitive emblem", async () => {
    const root = (await create()).shadowRoot!;
    const emblem = root.querySelector("svg.emblem")!;
    expect(emblem.getAttribute("viewBox")).toBe("0 0 313 273");
    expect(emblem.querySelectorAll("path")).toHaveLength(8);
  });

  it("renders the info box with three titled lists and the buttons", async () => {
    const root = (await create()).shadowRoot!;
    expect(text(root.querySelector(".info .header"))).toBe("Info");
    expect([...root.querySelectorAll(".infotext .title")].map(text)).toEqual([
      "Skill rating",
      "Competitive Matches",
      "Seasons",
    ]);
    const lists = [...root.querySelectorAll(".infotext ul")].map((list) =>
      [...list.querySelectorAll("li")].map(text),
    );
    expect(lists).toEqual([
      [
        "10 Placement matches",
        "Skill rating determined (1-5000)",
        "Skill rating adjusts after each win or loss",
      ],
      ["Matches last multiple rounds", "Earn points by taking objectives", "Most points win!"],
      ["New season every 3 months", "Earn exclusive rewards", "Placement starts again each season"],
    ]);
    expect([...root.querySelectorAll(".infobox button")].map(text)).toEqual([
      "Tier Legend",
      "Leaderboard",
      "Play",
    ]);
    expect(root.querySelector(".infobox button.big.yellow")).not.toBeNull();
  });

  it("goes back from the return strip", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const root = (await create()).shadowRoot!;
    root.querySelector<HTMLElement>("#return")!.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("goes back from the back button", async () => {
    const spy = vi.spyOn(history, "back").mockImplementation(() => {});
    const root = (await create()).shadowRoot!;
    const button = root.querySelector("overwebs-global-button")!;
    expect(button.action).toBe("back");
    button.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("queues for competitive play from the Play button, in the competitive accent", async () => {
    const root = (await create()).shadowRoot!;
    const listener = vi.fn<(event: CustomEvent<{ type: string; accent: string }>) => void>();
    document.addEventListener("queue", listener);
    root.querySelector<HTMLElement>(".infobox button.blue")!.click();
    expect(listener).not.toHaveBeenCalled();
    root.querySelector<HTMLElement>(".infobox button.big.yellow")!.click();
    document.removeEventListener("queue", listener);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]![0].detail).toEqual({
      type: "Competitive Play",
      accent: playTileAccent("competitive-play"),
    });
  });
});
