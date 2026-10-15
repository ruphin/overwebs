import { GluonElement, css, html } from "@gluon/gluon";
import { cursorStyles } from "./cursor-styles.js";
import { back } from "../lib/router.js";
import { modesPageStyles } from "./modes-page-styles.js";

/** The detail of the `queue` event: the kind of game to queue for. */
export interface QueueRequest {
  type: string;
}

/**
 * The play page: Quick Play (queues), Arcade, Competitive Play, Play vs. AI
 * and Custom Game. Dispatches `queue` when Quick Play is clicked.
 */
export class OverwebsPlayPage extends GluonElement {
  static override styles = [
    cursorStyles,
    modesPageStyles,
    css`
      overwebs-page-title {
        top: calc(154 * var(--u));
      }

      @media (orientation: portrait) {
        overwebs-page-title {
          top: var(--top-bar);
        }
      }
    `,
  ];

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-page-title text="Play"></overwebs-page-title>
      <div class="modes">
        <overwebs-play-tile
          .mode=${"quick-play"}
          .heading=${"Quick Play"}
          .description=${"Jump into a game against other players of your skill level."}
          @click=${this.#quickPlay}
        ></overwebs-play-tile>
        <a href="/arcade">
          <overwebs-play-tile
            .mode=${"arcade"}
            .heading=${"Arcade"}
            .description=${"New game modes! New Rules! New maps! Enter the arcade."}
          ></overwebs-play-tile>
        </a>
        <a href="/competitive">
          <overwebs-play-tile
            info
            .mode=${"competitive-play"}
            .heading=${"Competitive Play"}
            .description=${"Compete against other players and work your way up the ranks."}
          ></overwebs-play-tile>
        </a>
        <a href="/vs-ai">
          <overwebs-play-tile
            .mode=${"play-vs-ai"}
            .heading=${"Play vs. AI"}
            .description=${"Hone your skills against a team of AI-controlled heroes."}
          ></overwebs-play-tile>
        </a>
        <overwebs-play-tile
          .mode=${"custom-game"}
          .heading=${"Custom Game"}
          .description=${"Change the rules and play a game with your friends or AI."}
        ></overwebs-play-tile>
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }

  #quickPlay = () => {
    this.dispatchEvent(
      new CustomEvent<QueueRequest>("queue", {
        detail: { type: "Quick Play" },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    queue: CustomEvent<QueueRequest>;
  }
}
