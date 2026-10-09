import { GluonElement, html } from "@gluon/gluon";
import { back } from "../lib/router.js";
import { modesPageStyles } from "./modes-page-styles.js";

/** The training page: Tutorial, Practice Range and Practice vs. AI. */
export class OverwebsTrainingPage extends GluonElement {
  static override styles = modesPageStyles;

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-page-title text="Training"></overwebs-page-title>
      <div class="modes">
        <overwebs-play-tile
          .mode=${"tutorial"}
          .heading=${"Tutorial"}
          .description=${"Learn the basics of Overwatch."}
        ></overwebs-play-tile>
        <overwebs-play-tile
          .mode=${"practice-range"}
          .heading=${"Practice Range"}
          .description=${"Practice using your weapons and abilities."}
        ></overwebs-play-tile>
        <a href="/vs-ai">
          <overwebs-play-tile
            .mode=${"play-vs-ai"}
            .heading=${"Practice vs. AI"}
            .description=${"Hone your skill by playing against AI-controlled heroes."}
          ></overwebs-play-tile>
        </a>
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }
}
