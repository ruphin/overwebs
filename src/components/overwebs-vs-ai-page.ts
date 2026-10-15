import { GluonElement, html } from "@gluon/gluon";
import { cursorStyles } from "./cursor-styles.js";
import { back } from "../lib/router.js";
import { modesPageStyles } from "./modes-page-styles.js";

/** The VS. AI page: Easy, Medium and Hard AI difficulty. */
export class OverwebsVsAiPage extends GluonElement {
  static override styles = [cursorStyles, modesPageStyles];

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-page-title text="VS. AI"></overwebs-page-title>
      <div class="modes">
        <overwebs-play-tile
          .mode=${"easy-ai"}
          .heading=${"Easy"}
          .description=${"Play against easy difficulty AI-controlled heroes."}
        ></overwebs-play-tile>
        <overwebs-play-tile
          .mode=${"medium-ai"}
          .heading=${"Medium"}
          .description=${"Play against medium difficulty AI-controlled heroes."}
        ></overwebs-play-tile>
        <overwebs-play-tile
          .mode=${"hard-ai"}
          .heading=${"Hard"}
          .description=${"Play against hard difficulty AI-controlled heroes."}
        ></overwebs-play-tile>
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }
}
