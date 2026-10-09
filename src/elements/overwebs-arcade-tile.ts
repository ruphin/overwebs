import { define } from "@gluon/gluon";
import { OverwebsArcadeTile } from "../components/overwebs-arcade-tile.js";
export { OverwebsArcadeTile };
define(OverwebsArcadeTile, "overwebs-arcade-tile");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-arcade-tile": OverwebsArcadeTile;
  }
}
