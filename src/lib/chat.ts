/**
 * The chat logic, kept apart from the chat widget.
 *
 * The widget renders messages and takes input. Where a sent message goes and
 * which messages are shown is up to a `ChatHandler` that is passed to the
 * widget as its `handler` property. The widget calls `send()` with what the
 * player typed and shows every message the handler emits.
 *
 * `LocalChatHandler` echoes the player's own messages and nothing else.
 * `ApiChatHandler` (chat-api.ts) shares them through the chat server.
 */

/** A message in the chat log. */
export interface ChatMessage {
  author: string;
  channel: string;
  message: string;
  /** Unix time in milliseconds when the message was posted. */
  timestamp: number;
  /** The id given by the chat server, for messages that came from one. */
  id?: number;
}

export type ChatListener = (message: ChatMessage) => void;

/** What the chat widget needs from the chat logic. */
export interface ChatHandler {
  /**
   * Starts the handler. The widget calls this when it is connected, with a
   * signal that is aborted when it is disconnected or the handler is replaced.
   */
  connect(signal: AbortSignal): void;
  /** Sends a message typed by the player. */
  send(author: string, channel: string, message: string): void | Promise<void>;
  /**
   * Calls `listener` for every message to show, until the returned function
   * is called or `signal` is aborted.
   */
  subscribe(listener: ChatListener, options?: { signal?: AbortSignal }): () => void;
}

/** Delivers messages to subscribers; the emitting half of a `ChatHandler`. */
export class ChatEmitter {
  readonly #listeners = new Set<ChatListener>();

  subscribe(listener: ChatListener, options: { signal?: AbortSignal } = {}): () => void {
    const unsubscribe = () => this.#listeners.delete(listener);
    if (options.signal?.aborted) {
      return unsubscribe;
    }
    this.#listeners.add(listener);
    options.signal?.addEventListener("abort", unsubscribe, { once: true });
    return unsubscribe;
  }

  /** Shows a message to every subscriber. */
  emit(message: ChatMessage): void {
    for (const listener of [...this.#listeners]) {
      listener(message);
    }
  }
}

/** The chat without a server: the player sees their own messages only. */
export class LocalChatHandler extends ChatEmitter implements ChatHandler {
  connect(_signal: AbortSignal): void {
    // Nothing to start
  }

  send(author: string, channel: string, message: string): void {
    this.emit({ author, channel, message, timestamp: Date.now() });
  }
}
