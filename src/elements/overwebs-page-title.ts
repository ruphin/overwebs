import { define } from "@gluon/gluon";
import { OverwebsPageTitle } from "../components/overwebs-page-title.js";
export { OverwebsPageTitle };
define(OverwebsPageTitle, "overwebs-page-title");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-page-title": OverwebsPageTitle;
  }
}
