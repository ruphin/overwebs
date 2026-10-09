import { define } from "@gluon/gluon";
import { OverwebsPlayPage } from "../components/overwebs-play-page.js";
import "./overwebs-global-button.js";
import "./overwebs-page-title.js";
import "./overwebs-play-tile.js";
import "./overwebs-player-widget.js";
export { OverwebsPlayPage };
define(OverwebsPlayPage, "overwebs-play-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-play-page": OverwebsPlayPage;
  }
}
