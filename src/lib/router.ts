/**
 * A history based router. The route is the pathname without the leading
 * slash (`"main"`, `"hero-gallery"`) plus the query parameters.
 *
 * `installRouter()` turns every same-origin link click into a navigation,
 * so pages use plain `<a href="/play">` links.
 */
import { Store } from "./store.js";

export interface Route {
  /** The pathname without the leading slash, for example `"main"`. Empty at `/`. */
  readonly page: string;
  readonly params: URLSearchParams;
}

const routeFromLocation = (): Route => ({
  page: decodeURIComponent(location.pathname).replace(/^\/+/, "").replace(/\/+$/, ""),
  params: new URLSearchParams(location.search),
});

/** The current route. */
export const route = new Store<Route>(routeFromLocation());

/** Updates `route` from the location, when it changed. */
const syncRoute = (): void => {
  const next = routeFromLocation();
  const current = route.value;
  if (next.page !== current.page || next.params.toString() !== current.params.toString()) {
    route.set(next);
  }
};

/** Navigates to `path` (`"/play"`), pushing or replacing the history entry. */
export const navigate = (path: string, options: { replace?: boolean } = {}): void => {
  const url = new URL(path, location.href);
  if (url.href !== location.href) {
    if (options.replace) {
      history.replaceState(null, "", url);
    } else {
      history.pushState(null, "", url);
    }
  }
  syncRoute();
};

/** Goes back one history entry. */
export const back = (): void => {
  history.back();
};

const isPlainLeftClick = (event: MouseEvent): boolean =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const findAnchor = (event: Event): HTMLAnchorElement | undefined => {
  for (const node of event.composedPath()) {
    if (node instanceof HTMLAnchorElement) {
      return node;
    }
  }
  return undefined;
};

const handleClick = (event: MouseEvent): void => {
  if (event.defaultPrevented || !isPlainLeftClick(event)) {
    return;
  }
  const anchor = findAnchor(event);
  if (!anchor || !anchor.hasAttribute("href") || anchor.target || anchor.hasAttribute("download")) {
    return;
  }
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) {
    return;
  }
  event.preventDefault();
  navigate(url.pathname + url.search + url.hash);
};

let installed = false;

/** Starts routing: follows `popstate` and intercepts same-origin link clicks. */
export const installRouter = (options: { signal?: AbortSignal } = {}): void => {
  if (installed) {
    return;
  }
  installed = true;
  window.addEventListener("popstate", syncRoute, { signal: options.signal });
  document.addEventListener("click", handleClick, { signal: options.signal });
  options.signal?.addEventListener("abort", () => (installed = false), { once: true });
  syncRoute();
};
