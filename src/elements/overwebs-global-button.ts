import { define } from "@gluon/gluon";
import { OverwebsGlobalButton } from "../components/overwebs-global-button.js";
export { OverwebsGlobalButton };
define(OverwebsGlobalButton, "overwebs-global-button");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-global-button": OverwebsGlobalButton;
  }
}
