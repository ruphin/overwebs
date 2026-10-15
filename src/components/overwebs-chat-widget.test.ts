import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { OverwebsChatWidget } from "./overwebs-chat-widget.js";
import { player } from "../lib/player.js";

const press = (key: string) =>
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

const input = (element: OverwebsChatWidget) => element.shadowRoot!.querySelector("input")!;

const messageTexts = (element: OverwebsChatWidget) =>
  [...element.shadowRoot!.querySelectorAll(".message")].map((message) =>
    message.textContent?.trim(),
  );

const focused = (element: OverwebsChatWidget) => element.shadowRoot!.activeElement;

let restoreVisibility: (() => void) | undefined;

beforeAll(() => {
  customElements.define("test-overwebs-chat-widget", OverwebsChatWidget);
});

beforeEach(() => {
  // happy-dom does not lay out; treat every element as visible for the key bindings.
  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "checkVisibility");
  Object.defineProperty(HTMLElement.prototype, "checkVisibility", {
    value: () => true,
    configurable: true,
  });
  restoreVisibility = () => {
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, "checkVisibility", descriptor);
    } else {
      delete (HTMLElement.prototype as Partial<HTMLElement>).checkVisibility;
    }
  };
});

afterEach(() => {
  document.body.innerHTML = "";
  restoreVisibility?.();
  vi.useRealTimers();
});

const create = async () => {
  const element = new OverwebsChatWidget();
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-chat-widget", () => {
  it("is focusable and follows the player name", async () => {
    const element = await create();
    expect(element.getAttribute("tabindex")).toBe("0");
    expect(element.playerName).toBe(player.value.name);
    expect(element.shadowRoot!.querySelector(".channel")?.textContent).toBe("[General]: ");
  });

  it("renders messages in order, newest last", async () => {
    const element = await create();
    element.messages = [
      { author: "Ana", channel: "General", message: "first", timestamp: 1 },
      { author: "Mei", channel: "General", message: "second", timestamp: 2 },
    ];
    await element.updateComplete;
    expect(messageTexts(element)).toEqual(["[Ana]: first", "[Mei]: second"]);
  });

  it("appends posted messages", async () => {
    const element = await create();
    element.postMessage("Ana", "General", "hello");
    element.postMessage("Mei", "Team", "hi");
    await element.updateComplete;
    expect(messageTexts(element)).toEqual(["[Ana]: hello", "[Mei]: hi"]);
    expect(element.messages[1]).toMatchObject({ author: "Mei", channel: "Team", message: "hi" });
    expect(typeof element.messages[1]!.timestamp).toBe("number");
  });

  it("submits the input text as the player and clears the input", async () => {
    const element = await create();
    element.playerName = "Tracer";
    input(element).value = "Cheers love";
    element.submit();
    await element.updateComplete;
    expect(element.messages).toHaveLength(1);
    expect(element.messages[0]).toMatchObject({
      author: "Tracer",
      channel: "General",
      message: "Cheers love",
    });
    expect(input(element).value).toBe("");
  });

  it("ignores blank input", async () => {
    const element = await create();
    input(element).value = "   ";
    element.submit();
    input(element).value = "";
    element.submit();
    await element.updateComplete;
    expect(element.messages).toEqual([]);
  });

  it("toggles the focus class when focus enters and leaves", async () => {
    const element = await create();
    const outside = document.createElement("button");
    document.body.append(outside);
    element.focusInput();
    expect(focused(element)).toBe(input(element));
    expect(element.classList.contains("focus")).toBe(true);
    outside.focus();
    expect(element.classList.contains("focus")).toBe(false);
  });

  it("focuses the input on Enter, then submits", async () => {
    const element = await create();
    element.playerName = "Mercy";
    press("Enter");
    expect(focused(element)).toBe(input(element));
    expect(element.classList.contains("focus")).toBe(true);
    input(element).value = "Heroes never die";
    press("Enter");
    await element.updateComplete;
    expect(element.messages.map((message) => message.message)).toEqual(["Heroes never die"]);
    expect(input(element).value).toBe("");
    expect(focused(element)).toBe(input(element));
  });

  it("focuses the input when the button is clicked", async () => {
    const element = await create();
    element.shadowRoot!.querySelector<HTMLElement>(".button")!.click();
    expect(focused(element)).toBe(input(element));
  });

  it("ignores clicks on the log", async () => {
    const element = await create();
    element.shadowRoot!.querySelector<HTMLElement>(".chatBox")!.click();
    expect(focused(element)).toBeNull();
    expect(element.classList.contains("focus")).toBe(false);
  });

  it("blurs on Escape while focused, and only then", async () => {
    const element = await create();
    const other = document.createElement("button");
    document.body.append(other);
    const otherClick = vi.fn();
    other.addEventListener("click", otherClick);
    const { bindKey } = await import("../lib/keybindings.js");
    const controller = new AbortController();
    bindKey("Escape", other, { signal: controller.signal });

    element.focusInput();
    press("Escape");
    expect(focused(element)).toBeNull();
    expect(element.classList.contains("focus")).toBe(false);
    expect(otherClick).not.toHaveBeenCalled();

    press("Escape");
    expect(otherClick).toHaveBeenCalledOnce();
    controller.abort();
  });

  it("posts the introduction 10 seconds after connecting, once", async () => {
    vi.useFakeTimers();
    const element = await create();
    vi.advanceTimersByTime(9_999);
    expect(element.messages).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(element.messages).toHaveLength(1);
    expect(element.messages[0]).toMatchObject({
      author: "Ruphin",
      channel: "General",
      message: "Welcome to Overwebs! Enable fullscreen with F11 for the best experience",
    });
    element.remove();
    document.body.append(element);
    vi.advanceTimersByTime(20_000);
    expect(element.messages).toHaveLength(1);
  });

  it("clears the introduction timer on disconnect", async () => {
    vi.useFakeTimers();
    const element = await create();
    element.remove();
    vi.advanceTimersByTime(20_000);
    expect(element.messages).toEqual([]);
  });
});
