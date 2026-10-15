/**
 * The matchmaking queue state. There is no real matchmaking: the queue runs
 * until it is cancelled.
 *
 * Every way to start a game (the play tiles, the arcade modes, the
 * competitive Play button, ...) dispatches a `queue` event with the queue
 * type and the accent colour of its tile; the app shell starts the queue
 * and shows the "Searching for game" notification in that colour.
 */
import { Store } from "./store.js";

/** A request to queue for a game. */
export interface QueueRequest {
  /** The queue type, for example "Quick Play". */
  readonly type: string;
  /** The accent colour of the notification: the primary colour of the mode's tile. */
  readonly accent: string;
}

/** The accent of queues that do not name one. */
export const DEFAULT_ACCENT = "#b200ff";

export type QueueState =
  | { readonly queued: false }
  | (QueueRequest & {
      readonly queued: true;
      /** When the queue started, as `Date.now()`. */
      readonly start: number;
    });

export const queueState = new Store<QueueState>({ queued: false });

export const startQueue = (type: string, accent: string = DEFAULT_ACCENT): void => {
  queueState.set({ queued: true, type, accent, start: Date.now() });
};

export const stopQueue = (): void => {
  queueState.set({ queued: false });
};

/** The bubbling, composed `queue` event for `request`. */
export const queueEvent = (request: QueueRequest): CustomEvent<QueueRequest> =>
  new CustomEvent<QueueRequest>("queue", { detail: request, bubbles: true, composed: true });

/** Formats a duration in milliseconds as `m:ss`. */
export const formatElapsed = (milliseconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

declare global {
  interface GlobalEventHandlersEventMap {
    queue: CustomEvent<QueueRequest>;
  }
}
