import { GluonElement, css, html } from "@gluon/gluon";
import { queueEvent } from "../lib/game-state.js";

/** The game modes a play tile can show. */
export type PlayMode =
  | "quick-play"
  | "arcade"
  | "competitive-play"
  | "play-vs-ai"
  | "custom-game"
  | "tutorial"
  | "practice-range"
  | "easy-ai"
  | "medium-ai"
  | "hard-ai";

/** The artwork name of each mode: `/tiles/<name>.png`, icon `/tiles/icon-<name>.png`. */
export const playTileImages: Readonly<Record<PlayMode, string>> = {
  "quick-play": "quickPlay",
  arcade: "arcade",
  "competitive-play": "competitivePlay",
  "play-vs-ai": "playVsAi",
  "custom-game": "customGame",
  tutorial: "tutorial",
  "practice-range": "practiceRange",
  "easy-ai": "easyAI",
  "medium-ai": "mediumAI",
  "hard-ai": "hardAI",
};

/** The primary colour of each mode's artwork, used as the accent of its queue notification. */
export const playTileAccents: Readonly<Record<PlayMode, string>> = {
  "quick-play": "#2f7be8",
  arcade: "#0ea44c",
  "competitive-play": "#a040d6",
  "play-vs-ai": "#e6b800",
  "custom-game": "#d13a1c",
  tutorial: "#3f6fd6",
  "practice-range": "#7cab48",
  "easy-ai": "#e6b800",
  "medium-ai": "#e6b800",
  "hard-ai": "#e6b800",
};

/** The accent colour of a mode. */
export function playTileAccent(mode: PlayMode): string {
  return playTileAccents[mode];
}

/** The AI difficulty modes have no icon. */
const modesWithoutIcon: ReadonlySet<PlayMode> = new Set(["easy-ai", "medium-ai", "hard-ai"]);

/** The background image URL of a mode. */
export function playTileImage(mode: PlayMode): string {
  return `/tiles/${playTileImages[mode]}.png`;
}

/** The icon URL of a mode, or `undefined` for the modes without an icon. */
export function playTileIcon(mode: PlayMode): string | undefined {
  return modesWithoutIcon.has(mode) ? undefined : `/tiles/icon-${playTileImages[mode]}.png`;
}

/**
 * The tall mode card on the play, training and vs-ai pages. With a `queue`
 * type, a click dispatches `queue` for it, in the accent colour of the mode.
 */
export class OverwebsPlayTile extends GluonElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: calc(417 * var(--u));
      height: calc(684 * var(--u));
      text-align: center;
      transition: transform 0.1s linear;
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

    @media (orientation: portrait) {
      .description {
        font-size: max(calc(20 * var(--u)), 11px);
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
      height: calc(330 * var(--u));
      display: flex;
      flex-direction: column;
      align-items: center;
      background: radial-gradient(
        ellipse farthest-corner at 50% -15%,
        #ebebee,
        #e4e4e8 50%,
        #d6d5dd
      );
    }

    .icon {
      margin-top: calc(30 * var(--u));
      width: calc(68 * var(--u));
      height: calc(68 * var(--u));
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    .heading {
      margin-top: calc(22 * var(--u));
      font-family: var(--font-display);
      font-size: calc(68 * var(--u));
      line-height: 1;
      color: #28354f;
      text-transform: uppercase;
      translate: calc(-3 * var(--u));
    }

    .description {
      width: 90%;
      margin-top: calc(18 * var(--u));
      font-family: var(--font-text);
      font-size: calc(20 * var(--u));
      line-height: 1.1;
      color: #5e7ba5;
      text-transform: uppercase;
    }

    .badge {
      position: absolute;
      bottom: 0;
      width: calc(50 * var(--u));
      height: calc(46 * var(--u));
      display: none;
      align-items: center;
      justify-content: center;
      background: #323e57;

      :host([info]) & {
        display: flex;
      }
    }

    .hotkey {
      right: calc(20 * var(--u));
    }

    .rmb {
      width: calc(26 * var(--u));
      height: calc(37 * var(--u));
      background: url("/tiles/rmb.png") center / contain no-repeat;
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
    heading: {},
    description: {},
    info: { type: Boolean, attribute: true, reflect: true },
    queue: {},
  };

  mode: PlayMode = "quick-play";
  heading = "";
  description = "";
  info = false;
  /** The queue type a click starts, for example "Quick Play"; no queue when empty. */
  queue = "";

  constructor() {
    super();
    this.addEventListener("click", () => {
      if (this.queue) {
        this.dispatchEvent(queueEvent({ type: this.queue, accent: playTileAccent(this.mode) }));
      }
    });
  }

  override render() {
    const icon = playTileIcon(this.mode);
    return html`
      <div class="tile" style=${`background-image: url(${playTileImage(this.mode)})`}>
        <div class="content">
          <div class="icon" style=${icon ? `background-image: url(${icon})` : ""}></div>
          <div class="heading">${this.heading}</div>
          <div class="description">${this.description}</div>
          <div class="badge hotkey"><div class="rmb"></div></div>
          <div class="badge info"><div class="i">i</div></div>
        </div>
      </div>
    `;
  }
}
