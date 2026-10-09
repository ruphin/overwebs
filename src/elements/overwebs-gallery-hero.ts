import { define } from "@gluon/gluon";
import { OverwebsGalleryHero } from "../components/overwebs-gallery-hero.js";
export { OverwebsGalleryHero };
define(OverwebsGalleryHero, "overwebs-gallery-hero");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-gallery-hero": OverwebsGalleryHero;
  }
}
