import { GluonElement, css, html } from "@gluon/gluon";
import { selectBackgrounds, type BackgroundSelection } from "../lib/backgrounds.js";
import { ApiChatHandler } from "../lib/chat-api.js";
import { LocalChatHandler, type ChatHandler } from "../lib/chat.js";
import {
  formatElapsed,
  queueState,
  startQueue,
  stopQueue,
  type QueueState,
} from "../lib/game-state.js";
import { pages } from "../lib/pages.js";
import { navigate, route, type Route } from "../lib/router.js";
import { login, logout, restoreSession } from "../lib/session.js";
import { settings } from "../lib/settings.js";
// The `login` event is declared by the login page, `queue` by `lib/game-state`.
import type {} from "./overwebs-login-page.js";
import type { OverwebsMainPage } from "./overwebs-main-page.js";

const MAIN_PAGE_TAG = "overwebs-main-page";

/**
 * The application shell. Owns routing, the login state, the background
 * selection, the matchmaking notification and the chat.
 *
 * Pages are rendered by tag from `pages`; a page is loaded on its first visit.
 * Listens for `login` (from the login page) and `queue` (from the play tiles
 * and pages): a queue starts in the accent colour of its tile and drops back
 * to the main page.
 */
export class OverwebsApp extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      background: black;
      width: 100vw;
      height: 100dvh;
    }
  `;

  static override properties = {
    page: {},
    loggedIn: { type: Boolean },
    selection: { type: Object },
    queue: { type: Object },
    elapsed: {},
    lowBandwidth: { type: Boolean },
    onlineChat: { type: Boolean },
  };

  /** The current page (route name). */
  page = "";
  loggedIn = false;
  selection: BackgroundSelection | undefined = undefined;
  queue: QueueState = { queued: false };
  /** The elapsed queue time as `m:ss`, ticking while queued. */
  elapsed = "0:00";
  lowBandwidth = false;
  /** Whether the chat is shared through the chat server (the "Online Chat" setting). */
  onlineChat = true;
  /**
   * The chat logic given to the chat widget while the online chat is on:
   * `ApiChatHandler` shares messages through the chat server. Set before the
   * element is connected. With the online chat off, the widget gets a
   * `LocalChatHandler` (lib/chat.ts), which keeps messages on this screen.
   */
  chat: ChatHandler = new ApiChatHandler();
  readonly #localChat = new LocalChatHandler();

  /** Pages whose element module has been loaded. */
  readonly #loaded = new Set<string>();
  #pageTag: string | undefined;
  #pageElement: HTMLElement | undefined;
  #timer: ReturnType<typeof setInterval> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    const signal = this.disconnectSignal;
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
    this.addEventListener(
      "queue",
      (event) => {
        startQueue(event.detail.type, event.detail.accent);
        navigate("/main");
      },
      { signal },
    );

    queueState.subscribe((queue) => this.#onQueue(queue), { signal });
    settings.subscribe(
      (value) => {
        this.lowBandwidth = !value.animatedBackgrounds;
        this.onlineChat = value.onlineChat;
      },
      { signal },
    );
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
    // "Exit Game" ends the session and returns to the login screen
    if (page === "exit") {
      logout();
      this.loggedIn = false;
      navigate("/login", { replace: true });
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
    const entry = pages[this.page];
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
      ${this.#renderPage()}
      ${
        this.queue.queued
          ? html`<overwebs-notification
              spinner
              .accent=${this.queue.accent}
              .action=${"Cancel Search"}
              @action=${stopQueue}
            >
              <span slot="title">Searching for game</span>
              <div slot="message">
                <div>Estimated time: 1:42</div>
                <div>Elapsed time: ${this.elapsed}</div>
              </div>
            </overwebs-notification>`
          : null
      }
      <overwebs-chat-widget
        .handler=${this.onlineChat ? this.chat : this.#localChat}
        ?hidden=${this.page === "login"}
      ></overwebs-chat-widget>
    `;
  }
}
