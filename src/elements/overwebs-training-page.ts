import { define } from "@gluon/gluon";
import { OverwebsTrainingPage } from "../components/overwebs-training-page.js";
import "./overwebs-global-button.js";
import "./overwebs-page-title.js";
import "./overwebs-play-tile.js";
import "./overwebs-player-widget.js";
export { OverwebsTrainingPage };
define(OverwebsTrainingPage, "overwebs-training-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-training-page": OverwebsTrainingPage;
  }
}
