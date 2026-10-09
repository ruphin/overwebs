import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { OverwebsButton } from "./overwebs-button.js";

const create = async (setup?: (element: OverwebsButton) => void): Promise<OverwebsButton> => {
  const element = document.createElement("test-overwebs-button") as OverwebsButton;
  element.textContent = "Play";
  setup?.(element);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const inner = (element: OverwebsButton): HTMLButtonElement =>
  element.shadowRoot!.querySelector("button")!;

describe("overwebs-button", () => {
  beforeAll(() => {
    customElements.define("test-overwebs-button", OverwebsButton);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders a native button with a part and a default slot", async () => {
    const element = await create();
    const button = inner(element);
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("part")).toBe("button");
    expect(button.querySelector("slot:not([name])")).not.toBeNull();
    expect(button.disabled).toBe(false);
  });

  it("reflects the default variant and flags", async () => {
    const element = await create();
    expect(element.variant).toBe("yellow");
    expect(element.getAttribute("variant")).toBe("yellow");
    expect(element.hasAttribute("disabled")).toBe(false);
    expect(element.hasAttribute("block")).toBe(false);
  });

  it("reads and reflects the variant, block and disabled attributes", async () => {
    const element = await create((el) => {
      el.setAttribute("variant", "purple");
      el.setAttribute("block", "");
    });
    expect(element.variant).toBe("purple");
    expect(element.block).toBe(true);

    element.variant = "blue";
    element.disabled = true;
    await element.updateComplete;
    expect(element.getAttribute("variant")).toBe("blue");
    expect(element.hasAttribute("disabled")).toBe(true);
    expect(inner(element).disabled).toBe(true);

    element.disabled = false;
    await element.updateComplete;
    expect(element.hasAttribute("disabled")).toBe(false);
    expect(inner(element).disabled).toBe(false);
  });

  it("fires click on the host when enabled", async () => {
    const element = await create();
    const listener = vi.fn();
    element.addEventListener("click", listener);
    inner(element).click();
    element.click();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("does not fire click on the host when disabled", async () => {
    const element = await create((el) => {
      el.disabled = true;
    });
    const listener = vi.fn();
    element.addEventListener("click", listener);
    inner(element).click();
    element.click();
    expect(listener).not.toHaveBeenCalled();
  });
});
