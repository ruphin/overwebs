/**
 * The pages of the application, by route, with the element module that
 * registers each page. Pages other than the main and login page are loaded
 * on first visit.
 */

export interface Page {
  /** The custom element tag of the page. */
  readonly tag: string;
  /** Loads and registers the page element. */
  readonly load: () => Promise<unknown>;
}

export const pages: Readonly<Record<string, Page>> = {
  login: { tag: "overwebs-login-page", load: () => import("../elements/overwebs-login-page.js") },
  main: { tag: "overwebs-main-page", load: () => import("../elements/overwebs-main-page.js") },
  "hero-gallery": {
    tag: "overwebs-gallery-page",
    load: () => import("../elements/overwebs-gallery-page.js"),
  },
  play: { tag: "overwebs-play-page", load: () => import("../elements/overwebs-play-page.js") },
  competitive: {
    tag: "overwebs-competitive-page",
    load: () => import("../elements/overwebs-competitive-page.js"),
  },
  arcade: {
    tag: "overwebs-arcade-page",
    load: () => import("../elements/overwebs-arcade-page.js"),
  },
  training: {
    tag: "overwebs-training-page",
    load: () => import("../elements/overwebs-training-page.js"),
  },
  "vs-ai": { tag: "overwebs-vs-ai-page", load: () => import("../elements/overwebs-vs-ai-page.js") },
};
