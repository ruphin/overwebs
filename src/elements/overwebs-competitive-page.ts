import { define } from "@gluon/gluon";
import { OverwebsCompetitivePage } from "../components/overwebs-competitive-page.js";
import "./overwebs-global-button.js";
import "./overwebs-player-widget.js";
export { OverwebsCompetitivePage };
define(OverwebsCompetitivePage, "overwebs-competitive-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-competitive-page": OverwebsCompetitivePage;
  }
}
