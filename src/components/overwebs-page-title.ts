import { GluonElement, css, html } from "@gluon/gluon";

/**
 * The big gradient-filled, outlined page title ("PLAY", "ARCADE", ...) with
 * its entrance animation. The page positions the element.
 */
export class OverwebsPageTitle extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      width: 50%;
      height: calc(230 * var(--u));
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      animation: headermove 0.6s ease-out;
    }

    text {
      font-family: var(--font-display);
      font-size: calc(266 * var(--u));
      stroke-width: calc(3.232 * var(--u));
      stroke-linejoin: round;
    }

    /* Portrait: the title spans the screen under the top bar, in a smaller size. */
    @media (orientation: portrait) {
      :host {
        width: calc(100% - 2 * var(--page-gutter));
        height: calc(150 * var(--u));
      }

      text {
        font-size: calc(160 * var(--u));
      }
    }

    @keyframes headermove {
      from {
        opacity: 0;
        transform: translateY(calc(30 * var(--u)));
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  static override properties = { text: { attribute: true } };

  /** The title text. */
  text = "";

  override render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" role="heading" aria-level="1">
        <defs>
          <linearGradient id="fillgradient" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="#ffffff" offset="0" stop-opacity="0.9" />
            <stop stop-color="#ffffff" offset="1" stop-opacity="0.1" />
          </linearGradient>
          <linearGradient id="outlinegradient" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="#4C5C76" offset="0" stop-opacity="0.6" />
            <stop stop-color="#4C5C76" offset="1" stop-opacity="0.3" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="95%"
          stroke="url(#outlinegradient)"
          fill="url(#fillgradient)"
          .textContent=${this.text}
        ></text>
      </svg>
    `;
  }
}
