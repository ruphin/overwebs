import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { OverwebsPageTitle } from "./overwebs-page-title.js";

beforeAll(() => {
  customElements.define("test-overwebs-page-title", OverwebsPageTitle);
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("overwebs-page-title", () => {
  it("renders the text with the gradients", async () => {
    const element = new OverwebsPageTitle();
    element.text = "Play";
    document.body.append(element);
    await element.updateComplete;
    const text = element.shadowRoot!.querySelector("text");
    expect(text?.textContent).toBe("Play");
    expect(text?.getAttribute("fill")).toBe("url(#fillgradient)");
    expect(element.shadowRoot!.querySelector("#fillgradient")).not.toBeNull();
    expect(element.shadowRoot!.querySelector("#outlinegradient")).not.toBeNull();
  });

  it("updates the text and reads the attribute", async () => {
    document.body.innerHTML = `<test-overwebs-page-title text="Arcade"></test-overwebs-page-title>`;
    const element = document.body.firstElementChild as OverwebsPageTitle;
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector("text")?.textContent).toBe("Arcade");
    element.text = "VS. AI";
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector("text")?.textContent).toBe("VS. AI");
  });
});
