import { GluonElement, css, html } from "@gluon/gluon";
import { cursorStyles } from "./cursor-styles.js";

/** `accent` takes the colour of the enclosing `--accent` custom property. */
export type ButtonVariant = "yellow" | "blue" | "purple" | "accent";

/**
 * A styled button. The host wraps a real `<button>`, so focus, keyboard
 * activation and disabled semantics are native. Listen for `click` on the host.
 */
export class OverwebsButton extends GluonElement {
  static override styles = [
    cursorStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }

      :host([hidden]) {
        display: none;
      }

      :host([block]) {
        display: flex;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      button {
        all: unset;
        box-sizing: border-box;
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        text-shadow:
          0 0 calc(8 * var(--u)) rgba(255, 255, 255, 0.4),
          0 0 calc(2 * var(--u)) rgba(255, 255, 255, 0.8);
        font-family: var(--font-ui);
        text-transform: uppercase;
        white-space: nowrap;
        border-radius: calc(3 * var(--u));
        opacity: 0.95;
        cursor: var(--cursor);
      }

      @media (orientation: portrait) {
        :host([variant="yellow"]) button {
          min-height: 44px;
        }
      }

      :host([variant="yellow"]) button {
        height: calc(76 * var(--u));
        padding: 0 calc(66 * var(--u));
        background: rgba(240, 177, 64, 0.9);
        box-shadow:
          inset 0 0 calc(3 * var(--u)) calc(1 * var(--u)) rgb(208, 151, 52),
          0 0 0 calc(1 * var(--u)) rgb(120, 82, 36),
          0 0 calc(8 * var(--u)) calc(1 * var(--u)) rgb(120, 82, 36);
        font-size: calc(46 * var(--u));

        &:hover,
        &:active,
        &:focus-visible {
          box-shadow: 0 0 0 calc(3 / 1.1 * var(--u)) #ffffff;
          background: rgba(255, 194, 70, 0.9);
        }
      }

      :host([variant="blue"]) button,
      :host([variant="purple"]) button,
      :host([variant="accent"]) button {
        height: calc(48 * var(--u));
        padding: 0 calc(25 * var(--u));
        box-shadow:
          0 0 0 calc(1 * var(--u)) rgba(33, 95, 144, 0.4),
          0 0 calc(6 * var(--u)) calc(1 * var(--u)) rgba(33, 95, 144, 0.4);
        text-shadow: 0 0 calc(5 * var(--u)) rgba(255, 255, 255, 0.3);
        border-radius: calc(2 * var(--u));
        font-size: calc(28 * var(--u));

        &:hover,
        &:active,
        &:focus-visible {
          box-shadow: 0 0 0 calc(3 / 1.1 * var(--u)) #ffffff;
        }
      }

      :host([variant="blue"]) button {
        background: rgba(41, 139, 206, 0.9);

        &:hover,
        &:active,
        &:focus-visible {
          background: rgba(45, 153, 226, 0.9);
        }
      }

      :host([variant="purple"]) button {
        background: rgba(178, 0, 255, 0.9);

        &:hover,
        &:active,
        &:focus-visible {
          background: rgba(196, 5, 255, 0.9);
        }
      }

      :host([disabled]) button:is(*, :hover, :active, :focus-visible) {
        background: transparent;
        box-shadow:
          inset 0 0 calc(8 * var(--u)) rgba(151, 172, 181, 0.4),
          0 0 calc(8 * var(--u)) rgba(151, 172, 181, 0.4),
          inset 0 0 calc(3 * var(--u)) rgba(151, 172, 181, 0.7),
          0 0 calc(2 * var(--u)) calc(1 * var(--u)) rgb(151, 172, 181);
        color: rgba(141, 166, 181, 0.8);
        text-shadow:
          0 0 calc(8 * var(--u)) rgba(141, 166, 181, 0.4),
          0 0 calc(2 * var(--u)) rgba(141, 166, 181, 0.8);
      }

      /* The colour of the enclosing \`--accent\` custom property, purple without one. */
      :host([variant="accent"]) button {
        background: var(--accent, rgba(178, 0, 255, 0.9));

        &:hover,
        &:active,
        &:focus-visible {
          filter: brightness(1.12);
        }
      }

      :host([block]) button {
        padding: 0;
      }
    `,
  ];

  static override properties = {
    variant: { attribute: true, reflect: true },
    disabled: { type: Boolean, attribute: true, reflect: true },
    block: { type: Boolean, attribute: true, reflect: true },
  };

  variant: ButtonVariant = "yellow";
  disabled = false;
  block = false;

  constructor() {
    super();
    // A click dispatched on the host itself (e.g. `element.click()`) bypasses
    // the native disabled button; swallow it before any other listener runs.
    this.addEventListener(
      "click",
      (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      { capture: true },
    );
  }

  override render() {
    return html`<button type="button" part="button" ?disabled=${this.disabled}>
      <slot></slot>
    </button>`;
  }
}
