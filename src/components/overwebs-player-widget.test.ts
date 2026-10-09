import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { OverwebsPlayerWidget } from "./overwebs-player-widget.js";
import { defaultPlayer, player, type Player } from "../lib/player.js";

beforeAll(() => {
  customElements.define("test-overwebs-player-widget", OverwebsPlayerWidget);
});

afterEach(() => {
  document.body.innerHTML = "";
  player.set(defaultPlayer);
});

const mount = async () => {
  const element = new OverwebsPlayerWidget();
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const testPlayer: Player = {
  name: "Tester",
  level: 742,
  avatar: "abc",
  status: "busy",
  unlocks: {},
};

describe("overwebs-player-widget", () => {
  it("shows the player from the store", async () => {
    const element = await mount();
    const root = element.shadowRoot!;
    expect(element.player).toBe(defaultPlayer);
    expect(root.querySelector(".name")?.textContent).toBe("Ruphin");
    expect(root.querySelector(".level")?.textContent).toBe("42");
    expect(root.querySelectorAll(".star")).toHaveLength(1);
    expect(root.querySelector(".level-box")?.classList.contains("bronze")).toBe(true);
  });

  it("renders level, stars, rank, avatar and status of a player", async () => {
    const element = await mount();
    element.player = testPlayer;
    await element.updateComplete;
    const root = element.shadowRoot!;
    expect(root.querySelector(".name")?.textContent).toBe("Tester");
    expect(root.querySelector(".level")?.textContent).toBe("42");
    expect(root.querySelectorAll(".star")).toHaveLength(1);
    expect(root.querySelector(".level-box")?.classList.contains("silver")).toBe(true);
    expect(root.querySelector(".avatar")?.getAttribute("style")).toContain("/avatars/abc.png");
    expect(root.querySelector(".status")?.getAttribute("style")).toContain("red");
  });

  it("follows store changes while connected", async () => {
    const element = await mount();
    player.set(testPlayer);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector(".name")?.textContent).toBe("Tester");
    element.remove();
    player.set(defaultPlayer);
    expect(element.player).toBe(testPlayer);
  });
});
