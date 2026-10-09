import { define } from "@gluon/gluon";
import { OverwebsMainPage } from "../components/overwebs-main-page.js";
import "./overwebs-main-menu.js";
import "./overwebs-player-widget.js";
export { OverwebsMainPage };
define(OverwebsMainPage, "overwebs-main-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-main-page": OverwebsMainPage;
  }
}
