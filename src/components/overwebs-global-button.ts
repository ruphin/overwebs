import { GluonElement, css, html, type PropertyValues } from "@gluon/gluon";
import { bindKey, keybindings } from "../lib/keybindings.js";

/**
 * The "[Escape] Back" style hint button in the bottom right corner. Pressing
 * the key of its `action` clicks the element; the parent listens for `click`.
 */
export class OverwebsGlobalButton extends GluonElement {
  static override styles = css`
    :host {
      position: absolute;
      bottom: calc(44 * var(--u));
      right: calc(76 * var(--u));
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: calc(14 * var(--u));
      height: calc(60 * var(--u));
      padding: calc(7 * var(--u)) calc(21 * var(--u)) calc(7 * var(--u)) calc(7 * var(--u));
      border-radius: calc(5 * var(--u));
      font-family: var(--font-ui);
      line-height: 1;
      text-transform: uppercase;
    }

    .key {
      padding: 0 calc(12 * var(--u));
      border-radius: calc(3 * var(--u));
      box-shadow: 0 0 0 calc(2.6 * var(--u)) rgb(220 220 220 / 0.8);
      background: rgb(80 80 80 / 0.5);
      color: rgb(255 255 255 / 0.95);
      font-size: calc(20 * var(--u));
      line-height: 2.365;
    }

    .label {
      font-size: calc(27.36 * var(--u));
      color: rgb(220 220 220 / 0.8);
    }

    :host(:hover) {
      box-shadow: 0 0 0 calc(2.6 * var(--u)) rgb(220 220 220 / 0.8);

      .key {
        background: #eaecf4;
        box-shadow: 0 0 0 calc(2.6 * var(--u)) white;
        color: #313743;
      }

      .label {
        color: white;
      }
    }
  `;

  static override properties = {
    action: { attribute: true },
    label: { attribute: true },
  };

  /** The key of the binding in `keybindings` (`"back"`, `"apply"`, `"restore"`). */
  action = "";
  /** Overrides the label of the binding. */
  label = "";

  #binding: AbortController | undefined;

  /** The key bound to the current action, or `""` when the action is unknown. */
  get key(): string {
    return keybindings[this.action]?.key ?? "";
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#bind();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#binding?.abort();
    this.#binding = undefined;
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("action") && this.isConnected) {
      this.#bind();
    }
  }

  #bind() {
    this.#binding?.abort();
    this.#binding = new AbortController();
    if (this.key) {
      bindKey(this.key, this, { signal: this.#binding.signal });
    }
  }

  override render() {
    const label = this.label || keybindings[this.action]?.label || "";
    return html`
      ${this.key ? html`<span class="key">${this.key}</span>` : ""}
      <span class="label">${label}</span>
    `;
  }
}
