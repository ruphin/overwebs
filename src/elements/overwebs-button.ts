import { define } from "@gluon/gluon";
import { OverwebsButton } from "../components/overwebs-button.js";

export { OverwebsButton };

define(OverwebsButton, "overwebs-button");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-button": OverwebsButton;
  }
}
