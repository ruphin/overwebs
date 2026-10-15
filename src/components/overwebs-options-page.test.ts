import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-options-page.js";
import { settings, updateSettings } from "../lib/settings.js";
import type { OverwebsOptionsPage } from "./overwebs-options-page.js";
import type { OverwebsPageTitle } from "./overwebs-page-title.js";

const mount = async (): Promise<OverwebsOptionsPage> => {
  const element = document.createElement("overwebs-options-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const toggle = (element: OverwebsOptionsPage, name: string) =>
  element.shadowRoot!.querySelector<HTMLButtonElement>(`button[name="${name}"]`)!;

const state = (element: OverwebsOptionsPage, name: string) => ({
  checked: toggle(element, name).getAttribute("aria-checked"),
  text: toggle(element, name).textContent?.trim(),
});

describe("overwebs-options-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the title, player widget and back button", async () => {
    const root = (await mount()).shadowRoot!;
    expect(root.querySelector<OverwebsPageTitle>("overwebs-page-title")!.text).toBe("Options");
    expect(root.querySelector("overwebs-player-widget")).not.toBeNull();
    expect(root.querySelector("overwebs-global-button")!.getAttribute("action")).toBe("back");
  });

  it("shows a labelled On/Off switch per setting and follows the settings", async () => {
    updateSettings({ animatedBackgrounds: true, onlineChat: false });
    const element = await mount();
    const labels = [...element.shadowRoot!.querySelectorAll(".label")].map((label) =>
      label.textContent?.trim(),
    );
    expect(labels).toEqual(["Animated Backgrounds (needs high bandwidth)", "Online Chat"]);
    expect(toggle(element, "animatedBackgrounds").getAttribute("role")).toBe("switch");
    expect(state(element, "animatedBackgrounds")).toEqual({ checked: "true", text: "On" });
    expect(state(element, "onlineChat")).toEqual({ checked: "false", text: "Off" });
    updateSettings({ animatedBackgrounds: false, onlineChat: true });
    await element.updateComplete;
    expect(state(element, "animatedBackgrounds")).toEqual({ checked: "false", text: "Off" });
    expect(state(element, "onlineChat")).toEqual({ checked: "true", text: "On" });
  });

  it("flips a setting when its switch is clicked", async () => {
    updateSettings({ animatedBackgrounds: false, onlineChat: true });
    const element = await mount();
    toggle(element, "animatedBackgrounds").click();
    expect(settings.value).toEqual({ animatedBackgrounds: true, onlineChat: true });
    expect(JSON.parse(localStorage.getItem("settings")!)).toEqual(settings.value);
    toggle(element, "onlineChat").click();
    expect(settings.value).toEqual({ animatedBackgrounds: true, onlineChat: false });
    await element.updateComplete;
    expect(state(element, "onlineChat")).toEqual({ checked: "false", text: "Off" });
  });
});
