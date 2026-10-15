import { afterEach, describe, expect, it, vi } from "vitest";
import { loadSettings, prefersLowBandwidth, settings, updateSettings } from "./settings.js";

const connection = navigator as Navigator & { connection?: { saveData?: boolean } };

afterEach(() => {
  localStorage.clear();
  delete connection.connection;
  vi.unstubAllGlobals();
});

describe("prefersLowBandwidth", () => {
  it("is true with data saver on", () => {
    connection.connection = { saveData: true };
    expect(prefersLowBandwidth()).toBe(true);
  });

  it("is true on touch-only devices, false otherwise", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("hover: none") }));
    expect(prefersLowBandwidth()).toBe(true);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(prefersLowBandwidth()).toBe(false);
  });
});

describe("settings", () => {
  it("defaults animated backgrounds to the opposite of the bandwidth preference", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    expect(loadSettings()).toEqual({ animatedBackgrounds: true, onlineChat: true });
    connection.connection = { saveData: true };
    expect(loadSettings()).toEqual({ animatedBackgrounds: false, onlineChat: true });
  });

  it("reads stored settings and ignores anything else in storage", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    localStorage.setItem("settings", JSON.stringify({ animatedBackgrounds: false, other: 1 }));
    expect(loadSettings()).toEqual({ animatedBackgrounds: false, onlineChat: true });
    localStorage.setItem("settings", JSON.stringify({ onlineChat: false, animatedBackgrounds: 1 }));
    expect(loadSettings()).toEqual({ animatedBackgrounds: true, onlineChat: false });
    localStorage.setItem("settings", "not json");
    expect(loadSettings()).toEqual({ animatedBackgrounds: true, onlineChat: true });
  });

  it("updates the store and the storage", () => {
    const listener = vi.fn();
    const controller = new AbortController();
    settings.subscribe(listener, { signal: controller.signal });
    updateSettings({ animatedBackgrounds: false });
    expect(settings.value.animatedBackgrounds).toBe(false);
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ animatedBackgrounds: false }),
    );
    expect(JSON.parse(localStorage.getItem("settings")!)).toEqual(settings.value);
    updateSettings({ onlineChat: false });
    expect(settings.value).toEqual({ animatedBackgrounds: false, onlineChat: false });
    expect(JSON.parse(localStorage.getItem("settings")!)).toEqual(settings.value);
    updateSettings({ animatedBackgrounds: true, onlineChat: true });
    controller.abort();
  });
});
