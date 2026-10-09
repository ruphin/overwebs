import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { OverwebsBackground } from "./overwebs-background.js";
import { buildBackgroundSet, type Background, type BackgroundSet } from "../lib/backgrounds.js";

describe("overwebs-background", () => {
  let element: OverwebsBackground;
  let set: BackgroundSet;

  const bg = (name: string): Background => set[name]!;
  const videoOf = (name: string): HTMLVideoElement => element.videoFor(bg(name))!;
  const videos = () => [...element.renderRoot.querySelectorAll("video")];
  const visible = () => videos().filter((video) => !video.classList.contains("hidden"));

  beforeAll(() => {
    customElements.define("test-overwebs-background", OverwebsBackground);
  });

  beforeEach(async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    set = buildBackgroundSet("hollywood", "tracer");
    element = document.createElement("test-overwebs-background") as OverwebsBackground;
    element.backgrounds = set;
    document.body.append(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
    vi.restoreAllMocks();
  });

  it("creates one hidden, unmuted, lazy video per unique background", () => {
    const unique = new Set(Object.values(set));
    expect(videos()).toHaveLength(unique.size);
    expect(unique.size).toBeLessThan(Object.keys(set).length);
    for (const video of videos()) {
      expect(video.classList.contains("hidden")).toBe(true);
      expect(video.muted).toBe(false);
      expect(video.hasAttribute("playsinline")).toBe(true);
      expect(video.preload).toBe("none");
      expect(video.getAttribute("src")).toBeNull();
    }
    expect(videoOf("main").loop).toBe(true);
    expect(videoOf("to_main").loop).toBe(false);
  });

  it("reuses one element for mirrored sections", () => {
    expect(videoOf("training")).toBe(videoOf("play"));
    expect(videoOf("arcade_to_play")).toBe(videoOf("competitive_to_play"));
  });

  it("shows and plays the transition into the first page", async () => {
    element.page = "main";
    await element.updateComplete;
    const video = videoOf("to_main");
    expect(visible()).toEqual([video]);
    expect(video.poster).toContain(bg("to_main").image);
    expect(video.getAttribute("src")).toBe(bg("to_main").video);
    expect(video.preload).toBe("auto");
    expect(video.play).toHaveBeenCalled();
  });

  it("preloads the transition target and the preload targets", async () => {
    element.page = "main";
    await element.updateComplete;
    for (const name of ["main", "to_play", "to_hero-gallery"]) {
      expect(videoOf(name).getAttribute("src")).toBe(bg(name).video);
      expect(videoOf(name).preload).toBe("auto");
      expect(videoOf(name).poster).toContain(bg(name).image);
    }
    expect(videoOf("play").getAttribute("src")).toBeNull();
  });

  it("continues with the transition target when a transition video ends", async () => {
    element.page = "main";
    await element.updateComplete;
    videoOf("to_main").dispatchEvent(new Event("ended"));
    expect(visible()).toEqual([videoOf("main")]);
    // The continuation runs once.
    element.page = "play";
    await element.updateComplete;
    videoOf("to_main").dispatchEvent(new Event("ended"));
    expect(visible()).toEqual([videoOf("to_play")]);
  });

  it("hides the previous background and picks the most specific transition", async () => {
    element.page = "main";
    await element.updateComplete;
    element.page = "play";
    await element.updateComplete;
    expect(visible()).toEqual([videoOf("to_play")]);
    expect(videoOf("to_main").classList.contains("hidden")).toBe(true);
    element.page = "main";
    await element.updateComplete;
    expect(visible()).toEqual([videoOf("play_to_main")]);
  });

  it("cancels a pending transition when the page changes", async () => {
    element.page = "main";
    await element.updateComplete;
    element.page = "play";
    await element.updateComplete;
    videoOf("to_main").dispatchEvent(new Event("ended"));
    expect(visible()).toEqual([videoOf("to_play")]);
  });

  it("hides everything for a page without a background", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    element.page = "main";
    await element.updateComplete;
    element.page = "nowhere";
    await element.updateComplete;
    expect(visible()).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });

  it("shows only the poster of the chain end on low bandwidth", async () => {
    element.lowBandwidth = true;
    element.page = "main";
    await element.updateComplete;
    const video = videoOf("main");
    expect(visible()).toEqual([video]);
    expect(video.poster).toContain(bg("main").image);
    expect(video.getAttribute("src")).toBeNull();
    expect(videoOf("to_main").getAttribute("src")).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    // Preload targets resolve to their chain end and only get a poster.
    expect(videoOf("play").poster).toContain(bg("play").image);
    expect(videoOf("play").getAttribute("src")).toBeNull();
  });

  it("replaces the elements when the backgrounds change", async () => {
    element.page = "main";
    await element.updateComplete;
    const old = videos();
    set = buildBackgroundSet("volskaya", "genji");
    element.backgrounds = set;
    await element.updateComplete;
    expect(videos()).toHaveLength(new Set(Object.values(set)).size);
    for (const video of old) {
      expect(video.isConnected).toBe(false);
    }
    // The new set starts as if there was no previous page.
    expect(visible()).toEqual([videoOf("to_main")]);
    expect(videoOf("to_main").getAttribute("src")).toBe("/backgrounds/volskaya/genji/to_main.mp4");
  });

  it("ignores a rejected play()", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(
      new DOMException("interrupted", "AbortError"),
    );
    element.page = "main";
    await element.updateComplete;
    await Promise.resolve();
    expect(visible()).toEqual([videoOf("to_main")]);
    expect(videoOf("to_main").muted).toBe(false);
    expect(element.audioBlocked).toBe(false);
  });

  it("mutes the videos with the muted property", async () => {
    element.muted = true;
    element.page = "main";
    await element.updateComplete;
    expect(videoOf("to_main").muted).toBe(true);
    expect(element.hasAttribute("muted")).toBe(true);
    element.muted = false;
    await element.updateComplete;
    expect(videoOf("to_main").muted).toBe(false);
  });

  it("falls back to muted playback when audio is not allowed, until the user interacts", async () => {
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockImplementation(function (this: HTMLMediaElement) {
      return this.muted
        ? Promise.resolve()
        : Promise.reject(new DOMException("no gesture", "NotAllowedError"));
    });
    element.page = "main";
    await element.updateComplete;
    await Promise.resolve();
    await Promise.resolve();
    const video = videoOf("to_main");
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.muted).toBe(true);
    expect(element.audioBlocked).toBe(true);

    // Later videos start muted straight away while audio is blocked
    element.page = "play";
    await element.updateComplete;
    expect(videoOf("to_play").muted).toBe(true);

    document.dispatchEvent(new Event("pointerdown"));
    expect(element.audioBlocked).toBe(false);
    expect(videoOf("to_play").muted).toBe(false);
  });

  it("keeps the videos silent after an interaction when muted is set", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockImplementation(function (
      this: HTMLMediaElement,
    ) {
      return this.muted
        ? Promise.resolve()
        : Promise.reject(new DOMException("no gesture", "NotAllowedError"));
    });
    element.muted = true;
    element.page = "main";
    await element.updateComplete;
    await Promise.resolve();
    expect(element.audioBlocked).toBe(false);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(videoOf("to_main").muted).toBe(true);
  });
});
