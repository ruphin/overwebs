import { GluonElement, css, html, repeat, type PropertyValues } from "@gluon/gluon";
import { cursorStyles } from "./cursor-styles.js";
import { type ChatHandler, type ChatMessage, LocalChatHandler } from "../lib/chat.js";
import { bindKey } from "../lib/keybindings.js";
import { player } from "../lib/player.js";

export type { ChatMessage };

/**
 * The scripted welcome message, posted 10 seconds after the widget connects.
 * Touch screens are told to come back on a desktop, others to go fullscreen.
 */
const INTRODUCTION = {
  author: "Ruphin",
  channel: "General",
  greeting: "Welcome to Overwatch for web!",
  desktopTip: "Enable fullscreen with F11 for the best experience",
  mobileTip: "View on desktop devices for the best experience",
} as const;

const INTRODUCTION_DELAY = 10_000;

const TOUCH_SCREEN = "(hover: none) and (pointer: coarse)";

const introduction = (): string => {
  const touch = typeof matchMedia === "function" && matchMedia(TOUCH_SCREEN).matches;
  return `${INTRODUCTION.greeting} ${touch ? INTRODUCTION.mobileTip : INTRODUCTION.desktopTip}`;
};

/** Messages consisting only of control characters and spaces are not posted. */
const NON_PRINTABLE = /^[\x00-\x20]*$/;

/**
 * The chat in the bottom left corner. Messages stay local.
 *
 * Collapsed, it shows the last messages and a "Press Enter to chat" button,
 * and only the button takes clicks: the rest of the widget lets them through
 * to the page. While focus is inside the widget it has the `focus` class: the
 * log expands (and can be scrolled) and the entry box is shown. Enter focuses
 * the input, or posts its text when it is focused; Escape leaves the chat.
 */
export class OverwebsChatWidget extends GluonElement {
  static override styles = [
    cursorStyles,
    css`
      :host([hidden]) {
        display: none;
      }

      :host {
        /* The width of the log and the entry box; the log is a bit wider for its scrollbar. */
        --chat-width: calc(640 * var(--u));
        --chat-font: calc(25 * var(--u));
        /* The entry box (and the collapsed button) height; the log sits a gap above it. */
        --entry-height: calc(54 * var(--u));
        --log-gap: calc(16 * var(--u));
        /* The height of the log: a few lines collapsed, more while focused. */
        --log-height: calc(120 * var(--u));
        position: absolute;
        z-index: 10;
        bottom: calc(54 * var(--u));
        left: calc(54 * var(--u));
        font-family: var(--font-text);
        font-size: var(--chat-font);
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        outline: none;
        /* Clicks go through to the page, except on the button and the entry box; the log takes them when open. */
        pointer-events: none;
      }

      .button,
      .entryBox {
        pointer-events: auto;
      }

      .chatBox {
        z-index: 1;
        /* Puts the scrollbar on the left; the log switches back to ltr. */
        direction: rtl;
        box-sizing: border-box;
        position: absolute;
        bottom: calc(var(--entry-height) + var(--log-gap));
        left: calc(-26 * var(--u));
        padding-left: calc(26 * var(--u));
        width: calc(var(--chat-width) + 16 * var(--u));
        height: var(--log-height);
        overflow-y: scroll;
        color: #ffffff;
        line-height: 1.4;
        text-shadow: calc(0.6 * var(--u)) calc(0.8 * var(--u)) rgba(0, 0, 0, 0.65);

        &::-webkit-scrollbar {
          width: calc(14 * var(--u));
        }
        &::-webkit-scrollbar-track-piece {
          background-image: none;
        }
        &::-webkit-scrollbar-thumb {
          background: none;
          border-radius: calc(64 * var(--u));
          width: calc(14 * var(--u));
          height: calc(14 * var(--u));
        }
      }

      .chatLog {
        box-sizing: border-box;
        direction: ltr;
        min-height: var(--log-height);
        border-radius: calc(5 * var(--u));
        display: flex;
        flex-direction: column;
        /* Newest message last, at the bottom; short logs sit at the bottom too. */
        justify-content: flex-end;
        gap: calc(8 * var(--u));
      }

      .message {
        line-height: calc(30 * var(--u));
        user-select: text;
      }

      .chatShadow {
        position: absolute;
        left: 0;
        width: var(--chat-width);
        height: var(--log-height);
        bottom: calc(var(--entry-height) + var(--log-gap) / 2);
        border-radius: calc(5 * var(--u));
        background: rgba(0, 0, 0, 0);
        transition:
          background 0.2s,
          height 0.2s;
      }

      .button {
        height: var(--entry-height);
        line-height: var(--entry-height);
        font-family: var(--font-ui);
        text-transform: uppercase;
        font-size: calc(22 * var(--u));
        display: inline-block;
        box-shadow: 0 0 0 calc(2.6 * var(--u)) rgba(220, 220, 220, 0.8);
        border-radius: calc(5 * var(--u));
        color: rgba(255, 255, 255, 0.95);
        background: rgba(80, 80, 80, 0.5);
        padding-inline: calc(14 * var(--u));
        overflow: hidden;
        opacity: 0.5;

        &:hover,
        &:active {
          opacity: 0.9;
        }

        .short {
          display: none;
        }
      }

      .entryBox {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.65);
        border-radius: calc(5 * var(--u));
        padding-inline: calc(14 * var(--u));
        width: var(--chat-width);
        height: 0;
        overflow: hidden;
        color: #ffffff;
        line-height: 1.4;
        text-shadow: calc(0.5 * var(--u)) calc(0.5 * var(--u)) 0 rgba(0, 0, 0, 0.65);
      }

      .input {
        appearance: none;
        background: none;
        padding: 0;
        border: none;
        font-family: var(--font-text);
        font-size: var(--chat-font);
        color: #ffffff;
        text-shadow: calc(0.5 * var(--u)) calc(0.5 * var(--u)) 0 #000;
        line-height: 1.4;
        flex-grow: 1;
        margin-left: calc(6 * var(--u));
        user-select: text;

        &:focus {
          outline: none;
        }
      }

      /* The Escape key target: rendered (so it counts as visible) but not clickable. */
      .escape {
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        pointer-events: none;
      }

      :host(.focus) {
        --log-height: calc(284 * var(--u));

        .chatBox,
        .chatShadow {
          pointer-events: auto;
        }

        .chatBox {
          &::-webkit-scrollbar-track-piece {
            background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0) 0,
              rgba(0, 0, 0, 0) 35%,
              rgba(0, 0, 0, 0.05) 35%,
              rgba(0, 0, 0, 0.05) 65%,
              rgba(0, 0, 0, 0) 65%,
              rgba(0, 0, 0, 0)
            );
          }
          &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.8);
          }
        }
        .chatShadow {
          height: calc(var(--log-height) + var(--log-gap) + 6 * var(--u));
          background: rgba(0, 0, 0, 0.65);
        }
        .entryBox {
          height: var(--entry-height);
        }
        .button {
          height: 0;
          min-height: 0;
          padding: 0;
          box-shadow: none;
        }
      }

      /*
       * Touch screens: a tap opens the chat, so the button says so. The input
       * is at least 16px so iOS does not zoom in on it, and the entry box grows
       * with it.
       */
      @media (hover: none) {
        :host {
          --entry-height: max(calc(54 * var(--u)), 2.2em);
        }

        .button .long {
          display: none;
        }

        .button .short {
          display: inline;
        }

        .input {
          font-size: max(var(--chat-font), 16px);
        }
      }

      /*
       * Portrait: in the bottom bar, the button is a finger's size and the text
       * has a floor. Open, the chat is a panel: the log fills the screen from
       * the top bar down to the entry box.
       */
      @media (orientation: portrait) {
        :host {
          /* Leaves room for the back button on the right. */
          --chat-width: calc(100vw - 3 * var(--page-gutter) - 180 * var(--u));
          --chat-font: max(calc(25 * var(--u)), 16px);
          --entry-height: max(calc(60 * var(--u)), 44px);
          bottom: var(--page-gutter);
          left: var(--page-gutter);
        }

        :host(.focus) {
          --log-height: calc(
            100dvh - var(--top-bar) - var(--page-gutter) - var(--entry-height) - var(--log-gap)
          );
        }

        .button {
          font-size: max(calc(22 * var(--u)), 16px);
        }

        .message {
          line-height: 1.3;
        }
      }
    `,
  ];

  static override properties = {
    playerName: {},
    messages: { type: Array },
    channel: {},
    handler: { type: Object },
  };

  /** The name messages from the input are posted as. Follows the `player` store. */
  playerName = "";
  /** The chat log, newest last. */
  messages: ChatMessage[] = [];
  /** The channel messages from the input are posted to. */
  channel = "General";
  /**
   * Where sent messages go and where shown messages come from, see `lib/chat.ts`.
   * The default keeps messages local to this player.
   */
  handler: ChatHandler = new LocalChatHandler();

  /** Whether the log was scrolled to the bottom before the last change. */
  #shouldScroll = true;
  #introduced = false;
  /** Aborts the Escape binding; set while focus is inside the widget. */
  #escapeBinding: AbortController | undefined;
  /** The handler in use and the controller that detaches it. */
  #attachedHandler: ChatHandler | undefined;
  #handlerConnection: AbortController | undefined;

  constructor() {
    super();
    this.addEventListener("focusin", this.#onFocusIn);
    this.addEventListener("focusout", this.#onFocusOut);
    this.addEventListener("click", this.#onClick);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const signal = this.disconnectSignal;
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    player.subscribe((value) => (this.playerName = value.name), { signal });
    bindKey("Enter", this, { signal });
    this.#attachHandler();
    if (!this.#introduced) {
      const timer = setTimeout(() => {
        this.#introduced = true;
        this.postMessage(INTRODUCTION.author, INTRODUCTION.channel, introduction());
      }, INTRODUCTION_DELAY);
      signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#detachHandler();
    this.#unbindEscape();
    this.classList.remove("focus");
  }

  override render() {
    return html`
      <span class="escape" aria-hidden="true" @click=${this.#onEscape}></span>
      <div class="chatShadow"></div>
      <div class="chatBox">
        <div class="chatLog">
          ${repeat(
            this.messages,
            (message) => message,
            (message) =>
              html`<div class="message">
                [<span>${message.author}</span>]: <span>${message.message}</span>
              </div>`,
          )}
        </div>
      </div>
      <div class="button">
        <span class="long">Press Enter to chat</span><span class="short">Chat</span>
      </div>
      <div class="entryBox">
        <span class="channel">[${this.channel}]: </span
        ><input class="input" type="text" name="message" autocomplete="off" />
      </div>
    `;
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has("messages")) {
      this.#scrollToBottom();
    }
    if (changed.has("handler") && this.isConnected && this.#attachedHandler !== this.handler) {
      this.#detachHandler();
      this.#attachHandler();
    }
  }

  /** Appends a message to the log. */
  showMessage(message: ChatMessage): void {
    this.#shouldScroll = this.#isScrolledToBottom();
    this.messages = [...this.messages, message];
  }

  /** Appends a message to the log, as posted now. */
  postMessage(author: string, channel: string, message: string): void {
    this.showMessage({ author, channel, message, timestamp: Date.now() });
  }

  /**
   * Sends the text of the input through the handler as the player and clears the input.
   * Blank text is not sent; it leaves the chat instead, as Enter on an empty line does.
   */
  submit(): void {
    const input = this.#input;
    if (!input) {
      return;
    }
    const message = input.value;
    if (NON_PRINTABLE.test(message)) {
      this.#blur();
      return;
    }
    void this.handler.send(this.playerName, this.channel, message);
    input.value = "";
  }

  /** Shows what the handler emits and starts it, until it is detached. */
  #attachHandler(): void {
    const controller = new AbortController();
    this.#handlerConnection = controller;
    this.#attachedHandler = this.handler;
    this.handler.subscribe((message) => this.showMessage(message), { signal: controller.signal });
    this.handler.connect(controller.signal);
  }

  #detachHandler(): void {
    this.#handlerConnection?.abort();
    this.#handlerConnection = undefined;
    this.#attachedHandler = undefined;
  }

  /** Moves focus to the message input. */
  focusInput(): void {
    this.#input?.focus();
  }

  get #input(): HTMLInputElement | null {
    return this.renderRoot.querySelector<HTMLInputElement>(".input");
  }

  get #chatBox(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".chatBox");
  }

  #isScrolledToBottom(): boolean {
    const chatBox = this.#chatBox;
    return !chatBox || chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 1;
  }

  #scrollToBottom(): void {
    if (this.#shouldScroll) {
      this.#chatBox?.querySelector(".message:last-child")?.scrollIntoView({ block: "nearest" });
    }
  }

  /** Expands or collapses the log, keeping it at the bottom when it was. */
  #setFocused(focused: boolean): void {
    this.#shouldScroll = this.#isScrolledToBottom();
    this.classList.toggle("focus", focused);
    this.#scrollToBottom();
  }

  #onFocusIn = (): void => {
    if (!this.#escapeBinding) {
      this.#escapeBinding = new AbortController();
      const escape = this.renderRoot.querySelector<HTMLElement>(".escape");
      if (escape) {
        bindKey("Escape", escape, { override: true, signal: this.#escapeBinding.signal });
      }
    }
    this.#setFocused(true);
  };

  #onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget;
    if (
      next instanceof Node &&
      (next === this || this.contains(next) || this.renderRoot.contains(next))
    ) {
      return;
    }
    this.#unbindEscape();
    this.#setFocused(false);
  };

  #onClick = (event: MouseEvent): void => {
    event.stopPropagation();
    const target = event.composedPath()[0];
    if (target === this) {
      // The Enter key binding clicks the element itself: post, or open the chat.
      if (this.renderRoot instanceof ShadowRoot && this.renderRoot.activeElement === this.#input) {
        this.submit();
      } else {
        this.focusInput();
      }
      return;
    }
    if (this.#within(target, ".button") || this.#within(target, ".entryBox")) {
      event.preventDefault();
      this.focusInput();
    }
    // Clicks on the log only scroll it or select text.
  };

  /** Whether `target` is the element matching `selector` or inside it. */
  #within(target: unknown, selector: string): boolean {
    return (
      target instanceof Node && (this.renderRoot.querySelector(selector)?.contains(target) ?? false)
    );
  }

  #onEscape(event: MouseEvent): void {
    event.stopPropagation();
    this.#blur();
  }

  /** Moves focus out of the widget. */
  #blur(): void {
    const active = this.renderRoot instanceof ShadowRoot ? this.renderRoot.activeElement : null;
    if (active instanceof HTMLElement) {
      active.blur();
    } else if (document.activeElement === this) {
      this.blur();
    }
  }

  #unbindEscape(): void {
    this.#escapeBinding?.abort();
    this.#escapeBinding = undefined;
  }
}
