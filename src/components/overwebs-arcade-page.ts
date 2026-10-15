import { GluonElement, css, html } from "@gluon/gluon";
import { back } from "../lib/router.js";
import type { ArcadeMode } from "./overwebs-arcade-tile.js";

interface ArcadeTileData {
  readonly mode: ArcadeMode;
  readonly heading: string;
  readonly size: string;
  readonly popularity: number;
  readonly big?: boolean;
}

/** The arcade modes, in the order they are laid out (column by column). */
const tiles: readonly ArcadeTileData[] = [
  { mode: "mystery-duel", heading: "Mystery Duel", size: "1v1", popularity: 1, big: true },
  { mode: "elimination", heading: "Elimination", size: "3v3", popularity: 5 },
  { mode: "mystery-heroes", heading: "Mystery Heroes", size: "6v6", popularity: 0 },
  { mode: "all-brawls", heading: "All Brawls!", size: "6v6", popularity: 2 },
  { mode: "no-limits", heading: "No Limits", size: "6v6", popularity: 2 },
];

/** The arcade page: the title and the five arcade mode tiles. */
export class OverwebsArcadePage extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100dvh;
      background: rgba(0, 0, 0, 0.25);
    }

    overwebs-page-title {
      position: absolute;
      top: calc(154 * var(--u));
      left: calc(120 * var(--u));
    }

    .modes {
      margin: calc(400 * var(--u)) calc(195 * var(--u)) 0;
      height: calc(771 * var(--u));
      display: flex;
      flex-flow: column wrap;
      align-content: space-between;
      justify-content: space-between;

      > * {
        animation: fadein 0.2s linear both;

        &:hover {
          z-index: 2;
        }
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

    /* Portrait: the title under the top bar, the tiles in a column that scrolls. */
    @media (orientation: portrait) {
      overwebs-page-title {
        top: var(--top-bar);
        left: var(--page-gutter);
      }

      /* Clips at the title and the bottom bar, with room for a pressed tile (5% a side plus its shadow). */
      .modes {
        position: absolute;
        inset: calc(var(--top-bar) + 150 * var(--u)) 0 var(--bottom-bar);
        box-sizing: border-box;
        height: auto;
        margin: 0;
        padding: calc(48 * var(--u)) var(--page-gutter);
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, calc(780 * var(--u)));
        justify-content: center;
        align-content: start;
        gap: calc(16 * var(--u));
      }
    }
  `;

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-page-title text="Arcade"></overwebs-page-title>
      <div class="modes">
        ${tiles.map(
          (tile, index) => html`
            <overwebs-arcade-tile
              style=${`animation-delay: ${index * 50}ms`}
              ?big=${tile.big ?? false}
              .mode=${tile.mode}
              .size=${tile.size}
              .heading=${tile.heading}
              .popularity=${tile.popularity}
            ></overwebs-arcade-tile>
          `,
        )}
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }
}
