import { describe, expect, it } from "vitest";
import { GluonElement, css, define, html } from "@gluon/gluon";

class SmokeElement extends GluonElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;
  static override properties = { name: {} };
  name = "world";
  override render() {
    return html`<p>Hello ${this.name}</p>`;
  }
}
define(SmokeElement, "smoke-element");

describe("GluonJS in happy-dom", () => {
  it("renders into a shadow root and updates on property change", async () => {
    const element = new SmokeElement();
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector("p")?.textContent).toBe("Hello world");
    element.name = "overwebs";
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector("p")?.textContent).toBe("Hello overwebs");
    element.remove();
  });
});
