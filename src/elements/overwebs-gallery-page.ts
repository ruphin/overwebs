import { define } from "@gluon/gluon";
import { OverwebsGalleryPage } from "../components/overwebs-gallery-page.js";
import "./overwebs-gallery-hero.js";
import "./overwebs-global-button.js";
import "./overwebs-page-title.js";
import "./overwebs-player-widget.js";
export { OverwebsGalleryPage };
define(OverwebsGalleryPage, "overwebs-gallery-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-gallery-page": OverwebsGalleryPage;
  }
}
