import { GluonElement, css, html, repeat } from "@gluon/gluon";
import { cursorStyles } from "./cursor-styles.js";
import { back } from "../lib/router.js";
import { settings, updateSettings, type Settings } from "../lib/settings.js";

/** A setting shown on the page: a label and the key it switches. */
interface Option {
  readonly key: keyof Settings;
  readonly label: string;
}

const options: readonly Option[] = [
  { key: "animatedBackgrounds", label: "Animated Backgrounds (needs high bandwidth)" },
  { key: "onlineChat", label: "Online Chat" },
];

/**
 * The options page: the player's settings as rows in the style of the game's
 * options screen, a grey bar with the name on the left and an ON/OFF stepper
 * on the right. The row under the pointer turns white and its stepper blue;
 * a toggled row keeps no highlight.
 * Follows the `settings` store and writes changes to it.
 */
export class OverwebsOptionsPage extends GluonElement {
  static override styles = [
    cursorStyles,
    css`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100vw;
        height: 100dvh;
        background: rgba(0, 0, 0, 0.25);
        /*
         * The row metrics and colours, measured on the game's options screen
         * and scaled to the 2560 canvas. The bars are translucent: grey for the
         * names, light blue for the values, and the hovered row is white with
         * a solid blue value box.
         */
        --row-height: calc(60 * var(--u));
        --row-gap: calc(8 * var(--u));
        --row-font: calc(28 * var(--u));
        --value-width: calc(480 * var(--u));
        --value-gap: calc(8 * var(--u));
        --row-color: rgba(42, 58, 70, 0.5);
        --value-color: rgba(20, 135, 200, 0.48);
        --active-color: rgba(45, 135, 205, 0.92);
        /* The chevrons: as tall as the capitals, half as wide, drawn with a bold stroke. */
        --chevron-width: calc(12 * var(--u));
        --chevron-height: calc(20 * var(--u));
        --chevron-column: calc(58 * var(--u));
      }

      overwebs-page-title {
        position: absolute;
        top: calc(184 * var(--u));
        left: calc(120 * var(--u));
      }

      /* The rows are centred in the space between the title and the chat. */
      .content {
        position: absolute;
        inset: calc(378 * var(--u)) calc(120 * var(--u)) calc(220 * var(--u));
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: auto;
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: var(--row-gap);
        width: min(100%, calc(1660 * var(--u)));
      }

      .option {
        display: flex;
        align-items: stretch;
        gap: var(--value-gap);
        min-height: var(--row-height);
        font-family: var(--font-ui);
        font-size: var(--row-font);
        text-transform: uppercase;
        color: #ffffff;
        animation: fadein 0.2s linear both;

        &:nth-child(2) {
          animation-delay: 0.05s;
        }
        &:nth-child(3) {
          animation-delay: 0.1s;
        }
      }

      .label {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        padding: calc(8 * var(--u)) calc(28 * var(--u));
        background: var(--row-color);
        transition: background-color 0.08s linear;
      }

      /* The stepper: the value between two chevrons; the whole box toggles it. */
      .value {
        flex: none;
        width: var(--value-width);
        display: grid;
        grid-template-columns: var(--chevron-column) 1fr var(--chevron-column);
        align-items: center;
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 0;
        background: var(--value-color);
        color: inherit;
        font: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        transition: background-color 0.08s linear;

        &:focus {
          outline: none;
        }

        &:focus-visible {
          box-shadow: 0 0 0 calc(3 * var(--u)) #ffffff;
        }
      }

      .chevron {
        display: block;
        width: var(--chevron-width);
        height: var(--chevron-height);
        margin: auto;
        fill: none;
        stroke: #e6ecf4;
        stroke-width: 4;
        stroke-linecap: butt;
        stroke-linejoin: miter;
      }

      /* Only the pointer highlights a row; a keyboard focus shows as the ring on the value box. */
      .option:hover {
        .label {
          background: #ffffff;
          color: #2c2c38;
        }
        .value {
          background: var(--active-color);
        }
        .chevron {
          stroke: #ffffff;
        }
      }

      @keyframes fadein {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /*
       * Portrait: the title under the top bar, the rows centred between it and
       * the bottom bar, as wide as the page. The value box is narrower, so the
       * label keeps room to wrap.
       */
      @media (orientation: portrait) {
        :host {
          --value-width: calc(300 * var(--u));
        }

        overwebs-page-title {
          top: var(--top-bar);
          left: var(--page-gutter);
        }

        .content {
          inset: calc(var(--top-bar) + 150 * var(--u)) var(--page-gutter) var(--bottom-bar);
        }

        .options {
          width: 100%;
        }
      }

      /* Portrait phones: the value box takes a third of the row. */
      @media (orientation: portrait) and (max-width: 600px) {
        :host {
          --value-width: 33%;
        }
      }

      /* Touch screens: rows tall enough to tap and text that stays legible; no hover state. */
      @media (hover: none) {
        :host {
          --row-height: max(calc(60 * var(--u)), 44px);
          --row-font: max(calc(26 * var(--u)), 14px);
        }

        .option:hover {
          .label {
            background: var(--row-color);
            color: #ffffff;
          }
          .value {
            background: var(--value-color);
          }
          .chevron {
            stroke: #e6ecf4;
          }
        }
      }
    `,
  ];

  static override properties = { settings: { type: Object } };

  /** The current settings; follows the `settings` store while connected. */
  settings: Settings = settings.value;

  override connectedCallback(): void {
    super.connectedCallback();
    settings.subscribe((value) => (this.settings = value), { signal: this.disconnectSignal });
  }

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-page-title text="Options"></overwebs-page-title>
      <div class="content">
        <div class="options">
          ${repeat(
            options,
            (option) => option.key,
            (option) => this.#renderOption(option),
          )}
        </div>
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }

  #renderOption({ key, label }: Option) {
    const on = this.settings[key];
    const id = `option-${key}`;
    return html`
      <div class="option">
        <span class="label" id=${id}>${label}</span>
        <button
          class="value"
          type="button"
          role="switch"
          name=${key}
          aria-checked=${on ? "true" : "false"}
          aria-labelledby=${id}
          @click=${() => this.#toggle(key)}
        >
          <svg class="chevron" viewBox="0 0 12 20" aria-hidden="true">
            <path d="M10 2 L3 10 L10 18" />
          </svg>
          <span>${on ? "On" : "Off"}</span>
          <svg class="chevron" viewBox="0 0 12 20" aria-hidden="true">
            <path d="M2 2 L9 10 L2 18" />
          </svg>
        </button>
      </div>
    `;
  }

  #toggle(key: keyof Settings): void {
    updateSettings({ [key]: !this.settings[key] });
  }
}
