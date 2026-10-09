import { GluonElement, css, html } from "@gluon/gluon";
import { selectBackgrounds, type BackgroundSelection } from "../lib/backgrounds.js";
import {
  formatElapsed,
  queueState,
  startQueue,
  stopQueue,
  type QueueState,
} from "../lib/game-state.js";
import { pages } from "../lib/pages.js";
import { navigate, route, type Route } from "../lib/router.js";
import { login, restoreSession } from "../lib/session.js";
// The `login` and `queue` events are declared by the login and play pages.
import type {} from "./overwebs-login-page.js";
import type { OverwebsMainPage } from "./overwebs-main-page.js";
import type {} from "./overwebs-play-page.js";

const MAIN_PAGE_TAG = "overwebs-main-page";

/** Whether the device prefers saving data: data saver on, or a touch-only device. */
const prefersLowBandwidth = (): boolean => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData === true) {
    return true;
  }
  return (
    typeof matchMedia === "function" && matchMedia("(hover: none) and (pointer: coarse)").matches
  );
};

/**
 * The application shell. Owns routing, the login state, the background
 * selection, the matchmaking notification and the chat.
 *
 * Pages are rendered by tag from `pages`; a page is loaded on its first visit.
 * Listens for `login` (from the login page) and `queue` (from the play pages).
 */
export class OverwebsApp extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      background: black;
      width: 100vw;
      height: 100vh;
    }

    #exit {
      display: block;
      width: 100vw;
      height: 100vh;
      background: black;
    }
  `;

  static override properties = {
    page: {},
    loggedIn: { type: Boolean },
    selection: { type: Object },
    queue: { type: Object },
    elapsed: {},
    lowBandwidth: { type: Boolean },
  };

  /** The current page (route name), `"exit"` for the exit screen. */
  page = "";
  loggedIn = false;
  selection: BackgroundSelection | undefined = undefined;
  queue: QueueState = { queued: false };
  /** The elapsed queue time as `m:ss`, ticking while queued. */
  elapsed = "0:00";
  lowBandwidth = false;

  /** Pages whose element module has been loaded. */
  readonly #loaded = new Set<string>();
  #pageTag: string | undefined;
  #pageElement: HTMLElement | undefined;
  #timer: ReturnType<typeof setInterval> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    const signal = this.disconnectSignal;
    this.lowBandwidth = prefersLowBandwidth();
    this.selection ??= selectBackgrounds();
    this.loggedIn = restoreSession() !== null;

    this.addEventListener(
      "login",
      (event) => {
        login(event.detail);
        this.loggedIn = true;
        navigate("/main", { replace: true });
      },
      { signal },
    );
    this.addEventListener("queue", (event) => startQueue(event.detail.type), { signal });

    queueState.subscribe((queue) => this.#onQueue(queue), { signal });
    route.subscribe((current) => void this.#onRoute(current), { signal });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#stopTimer();
  }

  async #onRoute({ page, params }: Route): Promise<void> {
    const background = params.get("background");
    if (background) {
      this.selection = selectBackgrounds(background);
      navigate("/main", { replace: true });
      return;
    }
    if (!this.loggedIn && page !== "login") {
      navigate("/login", { replace: true });
      return;
    }
    if (this.loggedIn && (page === "" || page === "login" || page === "loading")) {
      navigate("/main", { replace: true });
      return;
    }
    if (page === "exit") {
      this.page = page;
      return;
    }
    const entry = pages[page];
    if (!entry) {
      console.warn(`Unknown page "${page}"`);
      navigate("/main", { replace: true });
      return;
    }
    this.page = page;
    if (!this.#loaded.has(page)) {
      await entry.load();
      this.#loaded.add(page);
      this.requestUpdate();
    }
  }

  #onQueue(queue: QueueState): void {
    this.queue = queue;
    if (!queue.queued) {
      this.#stopTimer();
      return;
    }
    const tick = () => (this.elapsed = formatElapsed(Date.now() - queue.start));
    tick();
    this.#stopTimer();
    this.#timer = setInterval(tick, 1000);
  }

  #stopTimer(): void {
    if (this.#timer !== undefined) {
      clearInterval(this.#timer);
      this.#timer = undefined;
    }
  }

  /** The element of the current page; the same node while the page stays the same. */
  #renderPage(): unknown {
    const entry = this.page === "exit" ? undefined : pages[this.page];
    if (!entry || !this.#loaded.has(this.page)) {
      this.#pageTag = undefined;
      this.#pageElement = undefined;
      return null;
    }
    if (this.#pageTag !== entry.tag || !this.#pageElement) {
      this.#pageTag = entry.tag;
      this.#pageElement = document.createElement(entry.tag);
    }
    if (entry.tag === MAIN_PAGE_TAG) {
      (this.#pageElement as OverwebsMainPage).selection = this.selection;
    }
    return this.#pageElement;
  }

  override render() {
    return html`
      <overwebs-background
        .backgrounds=${this.selection?.backgrounds}
        .page=${this.page}
        .lowBandwidth=${this.lowBandwidth}
      ></overwebs-background>
      ${this.#renderPage()} ${this.page === "exit" ? html`<a id="exit" href="/"></a>` : null}
      ${
        this.queue.queued
          ? html`<overwebs-notification spinner .action=${"Cancel Search"} @action=${stopQueue}>
              <span slot="title">Searching for game</span>
              <div slot="message">
                <div>Estimated time: 1:42</div>
                <div>Elapsed time: ${this.elapsed}</div>
              </div>
            </overwebs-notification>`
          : null
      }
      <overwebs-chat-widget ?hidden=${this.page === "login"}></overwebs-chat-widget>
    `;
  }
}
