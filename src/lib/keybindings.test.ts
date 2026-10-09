import { afterEach, describe, expect, it, vi } from "vitest";
import { bindKey } from "./keybindings.js";

const press = (key: string) =>
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

const visibleButton = () => {
  const button = document.createElement("button");
  document.body.append(button);
  // happy-dom does not lay out; stand in for a visible element.
  Object.defineProperty(button, "checkVisibility", { value: () => true, configurable: true });
  return button;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("bindKey", () => {
  it("clicks a bound visible element when its key is pressed", () => {
    const button = visibleButton();
    const onClick = vi.fn();
    button.addEventListener("click", onClick);
    const unbind = bindKey("Escape", button);
    press("Escape");
    expect(onClick).toHaveBeenCalledOnce();
    unbind();
    press("Escape");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("lets an override binding take precedence", () => {
    const first = visibleButton();
    const override = visibleButton();
    const firstClick = vi.fn();
    const overrideClick = vi.fn();
    first.addEventListener("click", firstClick);
    override.addEventListener("click", overrideClick);
    const controller = new AbortController();
    bindKey("Enter", first, { signal: controller.signal });
    bindKey("Enter", override, { override: true, signal: controller.signal });
    press("Enter");
    expect(overrideClick).toHaveBeenCalledOnce();
    expect(firstClick).not.toHaveBeenCalled();
    controller.abort();
    press("Enter");
    expect(overrideClick).toHaveBeenCalledOnce();
  });

  it("skips invisible elements", () => {
    const button = visibleButton();
    Object.defineProperty(button, "checkVisibility", { value: () => false });
    const onClick = vi.fn();
    button.addEventListener("click", onClick);
    const unbind = bindKey("Backspace", button);
    press("Backspace");
    expect(onClick).not.toHaveBeenCalled();
    unbind();
  });
});
