import { GluonElement, css, html, repeat, type PropertyValues } from "@gluon/gluon";
import { bindKey } from "../lib/keybindings.js";
import { player } from "../lib/player.js";

/** A message in the chat log. */
export interface ChatMessage {
  author: string;
  channel: string;
  message: string;
  /** `Date.now()` when the message was posted. */
  timestamp: number;
}

/** The scripted welcome message, posted 10 seconds after the widget connects. */
const INTRODUCTION = {
  author: "Ruphin",
  channel: "General",
  message: "Welcome to Overwebs! Enable fullscreen with F11 for the best experience",
} as const;

const INTRODUCTION_DELAY = 10_000;

/** Messages consisting only of control characters and spaces are not posted. */
const NON_PRINTABLE = /^[\x00-\x20]*$/;

/**
 * The chat in the bottom left corner. Messages stay local.
 *
 * Collapsed, it shows the last messages and a "Press Enter to chat" button.
 * While focus is inside the widget it has the `focus` class: the log expands
 * and the entry box is shown. Enter focuses the input, or posts its text when
 * it is focused; Escape leaves the chat.
 */
export class OverwebsChatWidget extends GluonElement {
  static override styles = css`
    :host([hidden]) {
      display: none;
    }

    :host {
      position: absolute;
      z-index: 10;
      bottom: calc(54 * var(--u));
      left: calc(54 * var(--u));
      font-family: var(--font-text);
      font-size: calc(25 * var(--u));
      display: flex;
      flex-flow: column;
      align-items: flex-start;
      outline: none;
    }

    .chatBox {
      z-index: 1;
      /* Puts the scrollbar on the left; the log switches back to ltr. */
      direction: rtl;
      box-sizing: border-box;
      position: absolute;
      bottom: calc(70 * var(--u));
      left: calc(-26 * var(--u));
      padding-left: calc(26 * var(--u));
      width: calc(550 * var(--u));
      height: calc(120 * var(--u));
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
      min-height: calc(120 * var(--u));
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
      width: calc(534 * var(--u));
      height: calc(120 * var(--u));
      bottom: calc(62 * var(--u));
      border-radius: calc(5 * var(--u));
      background: rgba(0, 0, 0, 0);
      transition:
        background 0.2s,
        height 0.2s;
    }

    .button {
      height: calc(54 * var(--u));
      line-height: calc(54 * var(--u));
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

      &:hover {
        opacity: 0.9;
      }
    }

    .entryBox {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.65);
      border-radius: calc(5 * var(--u));
      padding-inline: calc(14 * var(--u));
      width: calc(534 * var(--u));
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
      font-size: calc(25 * var(--u));
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
      .chatLog {
        min-height: calc(284 * var(--u));
      }
      .chatBox {
        height: calc(284 * var(--u));

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
        height: calc(306 * var(--u));
        background: rgba(0, 0, 0, 0.65);
      }
      .entryBox {
        height: calc(54 * var(--u));
      }
      .button {
        height: 0;
        padding: 0;
        box-shadow: none;
      }
    }
  `;

  static override properties = {
    playerName: {},
    messages: { type: Array },
    channel: {},
  };

  /** The name messages from the input are posted as. Follows the `player` store. */
  playerName = "";
  /** The chat log, newest last. */
  messages: ChatMessage[] = [];
  /** The channel messages from the input are posted to. */
  channel = "General";

  /** Whether the log was scrolled to the bottom before the last change. */
  #shouldScroll = true;
  #introduced = false;
  /** Aborts the Escape binding; set while focus is inside the widget. */
  #escapeBinding: AbortController | undefined;

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
    if (!this.#introduced) {
      const timer = setTimeout(() => {
        this.#introduced = true;
        this.postMessage(INTRODUCTION.author, INTRODUCTION.channel, INTRODUCTION.message);
      }, INTRODUCTION_DELAY);
      signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
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
      <div class="button">Press Enter to chat</div>
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
  }

  /** Appends a message to the log. */
  postMessage(author: string, channel: string, message: string): void {
    this.#shouldScroll = this.#isScrolledToBottom();
    this.messages = [...this.messages, { author, channel, message, timestamp: Date.now() }];
  }

  /**
   * Posts the text of the input as the player and clears the input.
   * Blank text is not posted; it leaves the chat instead, as Enter on an empty line does.
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
    this.postMessage(this.playerName, this.channel, message);
    input.value = "";
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
    event.preventDefault();
    if (this.renderRoot instanceof ShadowRoot && this.renderRoot.activeElement === this.#input) {
      this.submit();
    } else {
      this.focusInput();
    }
  };

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
