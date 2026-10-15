import { GluonElement, css, html } from "@gluon/gluon";

/**
 * The notification box at the top centre of the screen (used for the
 * matchmaking queue). Content goes in the `title` and `message` slots; the
 * optional button below the box dispatches `action`. The divider and the
 * button take the `accent` colour.
 */
export class OverwebsNotification extends GluonElement {
  static override styles = css`
    :host {
      position: absolute;
      z-index: 10;
      top: calc(42 * var(--u));
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      flex-flow: column;
      justify-content: space-between;
      gap: calc(3 * var(--u));
    }

    :host([hidden]) {
      display: none;
    }

    /* Portrait: below the top bar, no wider than the screen. */
    @media (orientation: portrait) {
      :host {
        top: var(--top-bar);
        width: max-content;
        max-width: calc(100vw - 2 * var(--page-gutter));
      }
    }

    @media (hover: none) {
      ::slotted([slot="title"]) {
        font-size: max(calc(30 * var(--u)), 15px);
      }

      ::slotted([slot="message"]) {
        font-size: max(calc(24 * var(--u)), 13px);
        line-height: 1.2;
      }
    }

    .notification {
      min-height: calc(62 * var(--u));
      display: flex;
      align-items: stretch;
      gap: calc(14 * var(--u));
      padding: calc(8 * var(--u)) calc(20 * var(--u)) calc(7 * var(--u)) calc(14 * var(--u));
      box-sizing: border-box;
      background: rgba(41, 54, 75, 0.9);
    }

    .spinner {
      flex-shrink: 0;
      align-self: center;
      margin-top: calc(4 * var(--u));
    }

    .accent {
      display: contents;
    }

    .divider {
      flex-shrink: 0;
      width: calc(3 * var(--u));
      margin-block: calc(6 * var(--u)) calc(7 * var(--u));
      background: var(--accent);
    }

    .text {
      display: flex;
      flex-flow: column;
      color: #ffffff;
      font-family: var(--font-ui);
      text-transform: uppercase;
    }

    ::slotted([slot="title"]) {
      color: #ffffff;
      font-size: calc(30 * var(--u));
      letter-spacing: calc(1.3 * var(--u));
    }

    ::slotted([slot="message"]) {
      color: #d0d0dc;
      font-size: calc(24 * var(--u));
      line-height: calc(26 * var(--u));
      margin-bottom: calc(1 * var(--u));
    }
  `;

  static override properties = {
    spinner: { type: Boolean, attribute: true, reflect: true },
    action: {},
    accent: {},
  };

  /** Show the loading spinner and the divider before the text. */
  spinner = false;
  /** Label of the button below the box; no button when empty. */
  action = "";
  /** The colour of the divider and the button. */
  accent = "#b200ff";

  override render() {
    return html`
      <div class="accent" style=${`--accent: ${this.accent}`}>
        <div class="notification">
          ${
            this.spinner
              ? html`<overwebs-loading-spinner
                    class="spinner"
                    white
                    .size=${50}
                  ></overwebs-loading-spinner>
                  <div class="divider"></div>`
              : null
          }
          <div class="text">
            <slot name="title"></slot>
            <slot name="message"></slot>
          </div>
        </div>
        ${
          this.action
            ? html`<overwebs-button variant="accent" @click=${this.handleAction}
                >${this.action}</overwebs-button
              >`
            : null
        }
      </div>
    `;
  }

  private handleAction(): void {
    this.dispatchEvent(new CustomEvent<void>("action", { bubbles: true, composed: true }));
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    action: CustomEvent<void>;
  }
}
