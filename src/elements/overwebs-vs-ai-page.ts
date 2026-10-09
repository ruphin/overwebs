import { define } from "@gluon/gluon";
import { OverwebsVsAiPage } from "../components/overwebs-vs-ai-page.js";
import "./overwebs-global-button.js";
import "./overwebs-page-title.js";
import "./overwebs-play-tile.js";
import "./overwebs-player-widget.js";
export { OverwebsVsAiPage };
define(OverwebsVsAiPage, "overwebs-vs-ai-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-vs-ai-page": OverwebsVsAiPage;
  }
}
