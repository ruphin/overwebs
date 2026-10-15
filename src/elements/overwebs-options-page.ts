import { define } from "@gluon/gluon";
import { OverwebsOptionsPage } from "../components/overwebs-options-page.js";
import "./overwebs-global-button.js";
import "./overwebs-page-title.js";
import "./overwebs-player-widget.js";
export { OverwebsOptionsPage };
define(OverwebsOptionsPage, "overwebs-options-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-options-page": OverwebsOptionsPage;
  }
}
