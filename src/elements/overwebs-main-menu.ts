import { define } from "@gluon/gluon";
import { OverwebsMainMenu } from "../components/overwebs-main-menu.js";
export { OverwebsMainMenu };
define(OverwebsMainMenu, "overwebs-main-menu");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-main-menu": OverwebsMainMenu;
  }
}
