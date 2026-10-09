import { define } from "@gluon/gluon";
import { OverwebsBackground } from "../components/overwebs-background.js";

export { OverwebsBackground };

define(OverwebsBackground, "overwebs-background");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-background": OverwebsBackground;
  }
}
