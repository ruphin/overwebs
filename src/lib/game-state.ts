/**
 * The matchmaking queue state. There is no real matchmaking: the queue runs
 * until it is cancelled.
 */
import { Store } from "./store.js";

export type QueueState =
  | { readonly queued: false }
  | {
      readonly queued: true;
      /** The queue type, for example "Quick Play". */
      readonly type: string;
      /** When the queue started, as `Date.now()`. */
      readonly start: number;
    };

export const queueState = new Store<QueueState>({ queued: false });

export const startQueue = (type: string): void => {
  queueState.set({ queued: true, type, start: Date.now() });
};

export const stopQueue = (): void => {
  queueState.set({ queued: false });
};

/** Formats a duration in milliseconds as `m:ss`. */
export const formatElapsed = (milliseconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
