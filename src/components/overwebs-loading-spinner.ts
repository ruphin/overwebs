import { GluonElement, css, html, svg } from "@gluon/gluon";

/** One hexagon, centred on the origin. */
const HEXAGON =
  "M-14.5 -95.6215 a29 29 0 0 1 29 0 l61.066641993582 35.256842193501 " +
  "a29 29 0 0 1 14.5 25.114736709749 l0 70.513684387002 " +
  "a29 29 0 0 1 -14.5 25.114736709749 l-61.066641993582 35.256842193501 " +
  "a29 29 0 0 1 -29 0 l-61.066641993582 -35.256842193501 " +
  "a29 29 0 0 1 -14.5 -25.114736709749 l0 -70.513684387002 " +
  "a29 29 0 0 1 14.5 -25.114736709749z";

/** Hexagon centres in animation order: clockwise from the top left, then the centre. */
const POSITIONS: readonly (readonly [number, number])[] = [
  [189.5, 119],
  [386.5, 119],
  [485, 288],
  [386.5, 457],
  [189.5, 457],
  [91, 288],
  [288, 288],
];

/** The seven-hexagon pulsing loading indicator. */
export class OverwebsLoadingSpinner extends GluonElement {
  static override styles = css`
    @keyframes pulse {
      0%,
      60%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      10%,
      50% {
        opacity: 0;
        transform: scale(0.5);
      }
    }

    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    svg {
      display: block;
    }

    path {
      animation: pulse 2.1s infinite;
    }

    :host([white]) path {
      fill: #ffffff;
    }
  `;

  static override properties = {
    size: { type: Number },
    white: { type: Boolean, attribute: true, reflect: true },
  };

  /** Width and height in design pixels. */
  size = 52;
  white = false;

  override render() {
    const size = `calc(${this.size} * var(--u))`;
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 576"
      role="img"
      aria-label="Loading"
      style=${`width: ${size}; height: ${size}`}
    >
      ${POSITIONS.map(
        ([x, y], index) =>
          svg`<g transform=${`translate(${x} ${y})`}><path d=${HEXAGON} style=${`animation-delay: ${index * 150}ms`}></path></g>`,
      )}
    </svg>`;
  }
}
