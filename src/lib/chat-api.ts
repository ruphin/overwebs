/**
 * The chat shared through the chat server (`/api/chat/messages`, see the
 * ruphin.net repository).
 *
 * Messages are received by long-polling: a request with the id of the newest
 * message seen is answered as soon as there is a newer one, or empty after a
 * while; the next request follows at once. The first request, without a
 * cursor, returns the recent history. Polling pauses while the page is hidden
 * and resumes from the cursor when it is shown again. Request failures are
 * retried with an increasing delay.
 *
 * Sending posts the message; the server's copy is shown at once and not again
 * when it arrives through the poll. A refused post is shown as a message from
 * "System" to the player only.
 */
import { ChatEmitter, type ChatHandler, type ChatMessage } from "./chat.js";

/** A message as the server sends it. */
interface ServerMessage {
  id: number;
  time: number;
  author: string;
  body: string;
}

interface MessagesResponse {
  last: number;
  messages: ServerMessage[];
}

export interface ApiChatOptions {
  /** The URL of the messages endpoint. */
  url?: string;
  /** The fetch implementation, for tests. */
  fetch?: typeof fetch;
  /** The document whose visibility pauses the polling, for tests. */
  document?: Pick<Document, "hidden" | "addEventListener" | "removeEventListener">;
}

export const DEFAULT_CHAT_URL = "/api/chat/messages";

const CHANNEL = "General";
const SYSTEM = "System";
/** The delays between retries of a failed poll, in milliseconds. */
const RETRY_MIN = 1_000;
const RETRY_MAX = 30_000;
/** How many server ids are remembered to drop a message shown twice. */
const REMEMBERED_IDS = 256;

/** What the player is told when the server refuses a post, by its reason. */
const REFUSALS: Record<string, string> = {
  fast: "Slow down, you can post again in a moment",
  limit: "You are posting too much, wait a minute",
  busy: "The chat is busy, try again in a moment",
  long: "That message is too long",
  banned: "You cannot post in this chat",
  empty: "That message cannot be posted",
  control: "That message cannot be posted",
  invalid: "That message cannot be posted",
};

const explain = (status: number, reason: string | undefined): string => {
  if (reason?.startsWith("author ")) {
    return "Your name cannot be used in the chat";
  }
  if (reason && REFUSALS[reason]) {
    return REFUSALS[reason];
  }
  if (status === 413) {
    return REFUSALS["long"]!;
  }
  return "The chat could not post your message";
};

const delay = (milliseconds: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(done, milliseconds);
    function done() {
      clearTimeout(timer);
      signal.removeEventListener("abort", done);
      resolve();
    }
    signal.addEventListener("abort", done, { once: true });
  });

export class ApiChatHandler extends ChatEmitter implements ChatHandler {
  readonly #url: string;
  readonly #fetch: typeof fetch;
  readonly #document: ApiChatOptions["document"];
  /** The id of the newest message received, or `undefined` before the history was loaded. */
  #last: number | undefined;
  /** The ids shown already, oldest first. */
  readonly #shown: number[] = [];
  /** Aborts the poll request in flight, when the page is hidden. */
  #inFlight: AbortController | undefined;

  constructor(options: ApiChatOptions = {}) {
    super();
    this.#url = options.url ?? DEFAULT_CHAT_URL;
    this.#fetch = options.fetch ?? ((input, init) => fetch(input, init));
    this.#document = options.document ?? (typeof document === "undefined" ? undefined : document);
  }

  connect(signal: AbortSignal): void {
    const onVisibilityChange = () => {
      if (this.#document?.hidden) {
        this.#inFlight?.abort();
      }
    };
    this.#document?.addEventListener("visibilitychange", onVisibilityChange);
    signal.addEventListener(
      "abort",
      () => {
        this.#document?.removeEventListener("visibilitychange", onVisibilityChange);
        this.#inFlight?.abort();
      },
      { once: true },
    );
    void this.#poll(signal);
  }

  async send(author: string, channel: string, message: string): Promise<void> {
    let response: Response;
    try {
      response = await this.#fetch(this.#url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ author, body: message }),
      });
    } catch {
      this.#system("The chat is unreachable right now");
      return;
    }
    if (response.ok) {
      this.#show((await response.json()) as ServerMessage);
      return;
    }
    let reason: string | undefined;
    try {
      reason = ((await response.json()) as { error?: string }).error;
    } catch {
      // Not a JSON error, the status will do
    }
    this.#system(explain(response.status, reason));
    void channel;
  }

  async #poll(signal: AbortSignal): Promise<void> {
    let retry = RETRY_MIN;
    while (!signal.aborted) {
      if (this.#document?.hidden) {
        await this.#visible(signal);
        continue;
      }
      const request = new AbortController();
      this.#inFlight = request;
      try {
        const query = this.#last === undefined ? "" : `?since=${this.#last}`;
        const response = await this.#fetch(this.#url + query, {
          signal: request.signal,
          headers: { accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`chat: ${response.status}`);
        }
        const data = (await response.json()) as MessagesResponse;
        this.#last = data.last;
        for (const message of data.messages) {
          this.#show(message);
        }
        retry = RETRY_MIN;
      } catch {
        if (signal.aborted) {
          return;
        }
        if (!request.signal.aborted) {
          await delay(retry, signal);
          retry = Math.min(retry * 2, RETRY_MAX);
        }
      } finally {
        this.#inFlight = undefined;
      }
    }
  }

  /** Resolves when the page is shown, or the signal is aborted. */
  #visible(signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (!this.#document?.hidden || signal.aborted) {
          this.#document?.removeEventListener("visibilitychange", check);
          signal.removeEventListener("abort", check);
          resolve();
        }
      };
      this.#document?.addEventListener("visibilitychange", check);
      signal.addEventListener("abort", check, { once: true });
    });
  }

  /** Shows a server message, unless it was shown before. */
  #show(message: ServerMessage): void {
    if (this.#shown.includes(message.id)) {
      return;
    }
    this.#shown.push(message.id);
    if (this.#shown.length > REMEMBERED_IDS) {
      this.#shown.shift();
    }
    this.emit({
      id: message.id,
      author: message.author,
      channel: CHANNEL,
      message: message.body,
      timestamp: message.time,
    });
  }

  #system(text: string): void {
    const message: ChatMessage = {
      author: SYSTEM,
      channel: CHANNEL,
      message: text,
      timestamp: Date.now(),
    };
    this.emit(message);
  }
}
