import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { OverwebsGlobalButton } from "./overwebs-global-button.js";

beforeAll(() => {
  customElements.define("test-overwebs-global-button", OverwebsGlobalButton);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const press = (key: string) =>
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

const mount = async (action: string, label = "") => {
  const element = new OverwebsGlobalButton();
  element.action = action;
  element.label = label;
  // happy-dom does not lay out; stand in for a visible element.
  Object.defineProperty(element, "checkVisibility", { value: () => true, configurable: true });
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("overwebs-global-button", () => {
  it("shows the key and label of its action", async () => {
    const element = await mount("back");
    const root = element.shadowRoot!;
    expect(root.querySelector(".key")?.textContent).toBe("Escape");
    expect(root.querySelector(".label")?.textContent).toBe("Back");
  });

  it("uses the label property over the binding label", async () => {
    const element = await mount("apply", "Confirm");
    expect(element.shadowRoot!.querySelector(".label")?.textContent).toBe("Confirm");
  });

  it("reads the action from the attribute", async () => {
    document.body.innerHTML = `<test-overwebs-global-button action="restore"></test-overwebs-global-button>`;
    const element = document.body.firstElementChild as OverwebsGlobalButton;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector(".key")?.textContent).toBe("Backspace");
    expect(element.shadowRoot!.querySelector(".label")?.textContent).toBe("Restore Defaults");
  });

  it("is clicked when its key is pressed", async () => {
    const element = await mount("back");
    const onClick = vi.fn();
    element.addEventListener("click", onClick);
    press("Escape");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("rebinds when the action changes", async () => {
    const element = await mount("back");
    const onClick = vi.fn();
    element.addEventListener("click", onClick);
    element.action = "apply";
    await element.updateComplete;
    press("Escape");
    expect(onClick).not.toHaveBeenCalled();
    press("Enter");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("unbinds on disconnect and rebinds on reconnect", async () => {
    const element = await mount("back");
    const onClick = vi.fn();
    element.addEventListener("click", onClick);
    element.remove();
    press("Escape");
    expect(onClick).not.toHaveBeenCalled();
    document.body.append(element);
    press("Escape");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders no key for an unknown action", async () => {
    const element = await mount("unknown", "Hint");
    expect(element.shadowRoot!.querySelector(".key")).toBeNull();
    expect(element.shadowRoot!.querySelector(".label")?.textContent).toBe("Hint");
  });
});
