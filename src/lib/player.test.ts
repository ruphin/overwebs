import { describe, expect, it } from "vitest";
import { displayLevel, prestigeRank, prestigeStars } from "./player.js";

describe("player levels", () => {
  it("wraps the display level every 100 levels", () => {
    expect(displayLevel(0)).toBe(0);
    expect(displayLevel(1)).toBe(1);
    expect(displayLevel(100)).toBe(100);
    expect(displayLevel(101)).toBe(1);
    expect(displayLevel(142)).toBe(42);
  });

  it("awards a prestige star per 100 levels, reset every 600", () => {
    expect(prestigeStars(0)).toBe(0);
    expect(prestigeStars(99)).toBe(0);
    expect(prestigeStars(142)).toBe(1);
    expect(prestigeStars(599)).toBe(5);
    expect(prestigeStars(601)).toBe(0);
  });

  it("ranks prestige by 600 levels", () => {
    expect(prestigeRank(142)).toBe("bronze");
    expect(prestigeRank(700)).toBe("silver");
    expect(prestigeRank(1300)).toBe("gold");
    expect(prestigeRank(5000)).toBe("gold");
  });
});
