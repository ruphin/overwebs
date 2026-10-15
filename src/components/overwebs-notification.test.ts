import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-notification.js";
import type { OverwebsButton } from "./overwebs-button.js";
import type { OverwebsLoadingSpinner } from "./overwebs-loading-spinner.js";
import type { OverwebsNotification } from "./overwebs-notification.js";

const create = async (
  setup?: (element: OverwebsNotification) => void,
): Promise<OverwebsNotification> => {
  const element = document.createElement("overwebs-notification");
  element.innerHTML = `<span slot="title">Searching for game</span><span slot="message">Elapsed time: 0:01</span>`;
  setup?.(element);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-notification", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders the title and message slots", async () => {
    const element = await create();
    const root = element.shadowRoot!;
    expect(root.querySelector('slot[name="title"]')).not.toBeNull();
    expect(root.querySelector('slot[name="message"]')).not.toBeNull();
  });

  it("has no spinner, divider or button by default", async () => {
    const element = await create();
    const root = element.shadowRoot!;
    expect(element.spinner).toBe(false);
    expect(element.hasAttribute("spinner")).toBe(false);
    expect(root.querySelector("overwebs-loading-spinner")).toBeNull();
    expect(root.querySelector(".divider")).toBeNull();
    expect(root.querySelector("overwebs-button")).toBeNull();
  });

  it("shows a white 50px spinner and the divider when spinner is set", async () => {
    const element = await create((el) => el.setAttribute("spinner", ""));
    expect(element.spinner).toBe(true);
    const spinner = element.shadowRoot!.querySelector<OverwebsLoadingSpinner>(
      "overwebs-loading-spinner",
    )!;
    expect(spinner).not.toBeNull();
    expect(spinner.size).toBe(50);
    expect(spinner.white).toBe(true);
    expect(element.shadowRoot!.querySelector(".divider")).not.toBeNull();

    element.spinner = false;
    await element.updateComplete;
    expect(element.hasAttribute("spinner")).toBe(false);
    expect(element.shadowRoot!.querySelector("overwebs-loading-spinner")).toBeNull();
  });

  it("renders an accent button labelled with the action", async () => {
    const element = await create((el) => {
      el.action = "Cancel Search";
    });
    const button = element.shadowRoot!.querySelector<OverwebsButton>("overwebs-button")!;
    expect(button.variant).toBe("accent");
    expect(button.textContent).toBe("Cancel Search");

    element.action = "";
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector("overwebs-button")).toBeNull();
  });

  it("dispatches a bubbling, composed action event when the button is clicked", async () => {
    const element = await create((el) => {
      el.action = "Cancel Search";
    });
    const listener = vi.fn<(event: CustomEvent<void>) => void>();
    document.body.addEventListener("action", listener);
    const button = element.shadowRoot!.querySelector<OverwebsButton>("overwebs-button")!;
    await button.updateComplete;
    button.shadowRoot!.querySelector("button")!.click();
    document.body.removeEventListener("action", listener);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0]![0];
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("is hidden with the native hidden attribute", async () => {
    const element = await create((el) => {
      el.hidden = true;
    });
    expect(element.hasAttribute("hidden")).toBe(true);
  });

  it("passes the accent colour to the divider and the button as --accent", async () => {
    const element = await create((el) => {
      el.spinner = true;
      el.action = "Cancel Search";
    });
    const accent = () => element.shadowRoot!.querySelector<HTMLElement>(".accent")!;
    expect(accent().getAttribute("style")).toContain("--accent: #b200ff");
    element.accent = "#0ea44c";
    await element.updateComplete;
    expect(accent().getAttribute("style")).toContain("--accent: #0ea44c");
    expect(accent().querySelector(".divider")).not.toBeNull();
    expect(accent().querySelector("overwebs-button")).not.toBeNull();
  });
});
