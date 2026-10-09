import { describe, expect, it } from "vitest";
import { buildBackgroundSet, selectBackgrounds, transitionFor } from "./backgrounds.js";

describe("backgrounds", () => {
  const set = buildBackgroundSet("hollywood", "tracer");

  it("uses shared videos for the map and own videos for the hero", () => {
    expect(set["play"]?.video).toBe("/backgrounds/hollywood/shared/play.mp4");
    expect(set["main"]?.video).toBe("/backgrounds/hollywood/tracer/main.mp4");
    expect(set["main"]?.image).toBe("/backgrounds/hollywood/tracer/main.jpg");
    expect(set["login"]?.video).toBeUndefined();
  });

  it("shares one background object between mirrored sections", () => {
    expect(set["training"]).toBe(set["play"]);
    expect(set["arcade_to_play"]).toBe(set["competitive_to_play"]);
  });

  it("chains transitions", () => {
    expect(set["to_play"]?.transition).toBe("play");
    expect(set["play_to_main"]?.transition).toBe("main");
  });

  it("finds the most specific transition", () => {
    expect(transitionFor(set, "play", "main")).toBe("play_to_main");
    expect(transitionFor(set, "main", "play")).toBe("to_play");
    expect(transitionFor(set, "", "main")).toBe("to_main");
    expect(transitionFor(set, "main", "login")).toBe("login");
    expect(transitionFor(set, "main", "nowhere")).toBeUndefined();
  });

  it("selects a matching set, or any set when nothing matches", () => {
    expect(selectBackgrounds("tracer", () => 0)).toMatchObject({
      map: "hollywood",
      hero: "tracer",
    });
    expect(selectBackgrounds("volskaya", () => 0.99)).toMatchObject({ map: "volskaya" });
    expect(selectBackgrounds("nobody", () => 0)).toMatchObject({
      map: "hollywood",
      hero: "tracer",
    });
  });
});
