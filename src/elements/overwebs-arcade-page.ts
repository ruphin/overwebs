import { define } from "@gluon/gluon";
import { OverwebsArcadePage } from "../components/overwebs-arcade-page.js";
import "./overwebs-arcade-tile.js";
import "./overwebs-page-title.js";
import "./overwebs-global-button.js";
import "./overwebs-player-widget.js";
export { OverwebsArcadePage };
define(OverwebsArcadePage, "overwebs-arcade-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-arcade-page": OverwebsArcadePage;
  }
}
