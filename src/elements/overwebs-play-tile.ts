import { define } from "@gluon/gluon";
import { OverwebsPlayTile } from "../components/overwebs-play-tile.js";
export { OverwebsPlayTile };
define(OverwebsPlayTile, "overwebs-play-tile");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-play-tile": OverwebsPlayTile;
  }
}
