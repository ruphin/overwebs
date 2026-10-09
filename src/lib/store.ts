/**
 * A minimal observable value, used for the application state that is shared
 * between components (the player, the queue, the route).
 *
 * Components subscribe in `connectedCallback()` with their `disconnectSignal`
 * so the subscription is removed when the element is disconnected:
 *
 *   player.subscribe((value) => (this.player = value), { signal: this.disconnectSignal });
 */
export type Listener<T> = (value: T) => void;

export class Store<T> {
  #value: T;
  readonly #listeners = new Set<Listener<T>>();

  constructor(value: T) {
    this.#value = value;
  }

  /** The current value. */
  get value(): T {
    return this.#value;
  }

  /** Replaces the value and notifies the listeners when it changed (by `Object.is`). */
  set(value: T): void {
    if (Object.is(value, this.#value)) {
      return;
    }
    this.#value = value;
    for (const listener of [...this.#listeners]) {
      listener(value);
    }
  }

  /** Replaces the value with the result of `update(current)`. */
  update(update: (value: T) => T): void {
    this.set(update(this.#value));
  }

  /**
   * Calls `listener` with the current value now, and again on every change,
   * until the returned function is called or `signal` is aborted.
   */
  subscribe(listener: Listener<T>, options: { signal?: AbortSignal } = {}): () => void {
    this.#listeners.add(listener);
    const unsubscribe = () => this.#listeners.delete(listener);
    if (options.signal?.aborted) {
      unsubscribe();
      return unsubscribe;
    }
    options.signal?.addEventListener("abort", unsubscribe, { once: true });
    listener(this.#value);
    return unsubscribe;
  }
}
