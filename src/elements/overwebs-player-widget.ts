import { define } from "@gluon/gluon";
import { OverwebsPlayerWidget } from "../components/overwebs-player-widget.js";
export { OverwebsPlayerWidget };
define(OverwebsPlayerWidget, "overwebs-player-widget");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-player-widget": OverwebsPlayerWidget;
  }
}
