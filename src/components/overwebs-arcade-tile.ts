import { GluonElement, css, html } from "@gluon/gluon";
import { queueEvent } from "../lib/game-state.js";
import { playTileAccent } from "./overwebs-play-tile.js";

/** The arcade modes an arcade tile can show. */
export type ArcadeMode =
  "mystery-duel" | "elimination" | "mystery-heroes" | "all-brawls" | "no-limits";

/** The artwork name of each mode: `/arcade/<name>.png`. */
export const arcadeTileImages: Readonly<Record<ArcadeMode, string>> = {
  "mystery-duel": "mysteryDuel",
  elimination: "elimination",
  "mystery-heroes": "mysteryHeroes",
  "all-brawls": "allBrawls",
  "no-limits": "noLimits",
};

/** The background image URL of a mode. */
export function arcadeTileImage(mode: ArcadeMode): string {
  return `/arcade/${arcadeTileImages[mode]}.png`;
}

/** The number of segments in the popularity bar, and the popularity that shows "Most Popular". */
export const MAX_POPULARITY = 5;

/** The accent of the arcade queues: the colour of the arcade tile on the play page. */
export const ARCADE_ACCENT = playTileAccent("arcade");

/**
 * The wide arcade mode card on the arcade page. With a `queue` type, a click
 * dispatches `queue` for it, in the arcade accent.
 */
export class OverwebsArcadeTile extends GluonElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: calc(640 * var(--u));
      height: calc(370 * var(--u));
      transition: transform 0.1s linear;
    }

    :host([big]) {
      width: calc(830 * var(--u));
      height: calc(771 * var(--u));
    }

    @media (hover: hover) {
      :host(:hover) {
        box-shadow: 0 0 0 calc(8.5 / 1.1 * var(--u)) #ffffff;
        transform: scale(1.1);
        z-index: 2;
      }
    }

    /* Touch screens: the same while the tile is pressed; it activates on release. */
    @media (hover: none) {
      :host(:active) {
        box-shadow: 0 0 0 calc(8.5 / 1.1 * var(--u)) #ffffff;
        transform: scale(1.1);
        z-index: 2;
      }
    }

    /*
     * Portrait: one column of equal tiles, narrow enough to grow when pressed.
     * The artwork strips (640x176) scale with the width and fill the space
     * above the content; the big tile's artwork (830x577) is cropped to its
     * middle band, where the figures are.
     */
    @media (orientation: portrait) {
      :host,
      :host([big]) {
        width: calc(780 * var(--u));
        height: calc(410 * var(--u));
      }

      :host([big]) .tile {
        background-size: 100% auto;
        background-position: center calc(-150 * var(--u));
      }
    }

    .tile {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background-size: contain;
      background-position: center top;
      background-repeat: no-repeat;
    }

    .content {
      position: relative;
      box-sizing: border-box;
      height: calc(196 * var(--u));
      padding-left: calc(20 * var(--u));
      display: flex;
      flex-direction: column;
      background: radial-gradient(
        ellipse farthest-corner at 50% -15%,
        #ebebee,
        #e4e4e8 50%,
        #d6d5dd
      );
    }

    .popularity {
      position: absolute;
      top: 0;
      left: 0;
      height: calc(34 * var(--u));
      display: flex;
    }

    .segments {
      width: calc(40 * var(--u));
      gap: 3.5%;
    }

    .segment {
      flex: 1;
      background: #bdbfc7;

      &.filled {
        background: #1c75bc;
      }
    }

    .most {
      box-sizing: border-box;
      min-width: calc(40 * var(--u));
      padding-inline: calc(14 * var(--u)) calc(17 * var(--u));
      align-items: center;
      background: #1c75bc;
      color: #ffffff;
      font-family: var(--font-ui);
      font-size: calc(18 * var(--u));
      text-transform: uppercase;
    }

    .size,
    .heading {
      font-family: var(--font-display);
      line-height: 1;
      text-transform: uppercase;
    }

    .size {
      margin-top: calc(58 * var(--u));
      font-size: calc(48 * var(--u));
      color: #1c75bc;
    }

    .heading {
      font-size: calc(78 * var(--u));
      color: #28354f;
    }

    .badge {
      position: absolute;
      bottom: 0;
      width: calc(50 * var(--u));
      height: calc(46 * var(--u));
      display: flex;
      align-items: center;
      justify-content: center;
      background: #323e57;
    }

    .hotkey {
      right: calc(20 * var(--u));
    }

    .rmb {
      width: calc(26 * var(--u));
      height: calc(37 * var(--u));
      background: url("/arcade/rmb.png") center / contain no-repeat;
    }

    .info {
      right: calc(73 * var(--u));
    }

    .i {
      width: calc(34 * var(--u));
      height: calc(34 * var(--u));
      line-height: calc(34 * var(--u));
      font-family: var(--font-ui);
      font-size: calc(30 * var(--u));
      color: #28354f;
      text-align: center;
      background: white;
      border-radius: 50%;
    }
  `;

  static override properties = {
    mode: {},
    big: { type: Boolean, attribute: true, reflect: true },
    size: {},
    heading: {},
    popularity: { type: Number },
    queue: {},
  };

  mode: ArcadeMode = "mystery-duel";
  big = false;
  size = "";
  heading = "";
  /** 0 to 5. The bar fills one segment per point; 5 shows "Most Popular". */
  popularity = 0;
  /** The queue type a click starts, for example "Mystery Duel"; no queue when empty. */
  queue = "";

  constructor() {
    super();
    this.addEventListener("click", () => {
      if (this.queue) {
        this.dispatchEvent(queueEvent({ type: this.queue, accent: ARCADE_ACCENT }));
      }
    });
  }

  override render() {
    const popularity = Math.min(MAX_POPULARITY, Math.max(0, Math.round(this.popularity) || 0));
    const bar =
      popularity === MAX_POPULARITY
        ? html`<div class="popularity most">Most Popular</div>`
        : html`<div class="popularity segments">
            ${Array.from(
              { length: MAX_POPULARITY },
              (_, index) =>
                html`<div class=${index < popularity ? "segment filled" : "segment"}></div>`,
            )}
          </div>`;
    return html`
      <div class="tile" style=${`background-image: url(${arcadeTileImage(this.mode)})`}>
        <div class="content">
          ${bar}
          <div class="size">${this.size}</div>
          <div class="heading">${this.heading}</div>
          <div class="badge hotkey"><div class="rmb"></div></div>
          <div class="badge info"><div class="i">i</div></div>
        </div>
      </div>
    `;
  }
}
