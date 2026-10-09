import { describe, expect, it, vi } from "vitest";
import { Store } from "./store.js";

describe("Store", () => {
  it("calls a subscriber with the current value and on every change", () => {
    const store = new Store(1);
    const listener = vi.fn();
    store.subscribe(listener);
    store.set(2);
    store.update((value) => value + 1);
    expect(listener.mock.calls.map(([value]) => value)).toEqual([1, 2, 3]);
    expect(store.value).toBe(3);
  });

  it("does not notify when the value is unchanged", () => {
    const store = new Store("a");
    const listener = vi.fn();
    store.subscribe(listener);
    store.set("a");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("stops notifying after unsubscribe or abort", () => {
    const store = new Store(0);
    const unsubscribed = vi.fn();
    const aborted = vi.fn();
    const controller = new AbortController();
    store.subscribe(unsubscribed)();
    store.subscribe(aborted, { signal: controller.signal });
    controller.abort();
    store.set(1);
    expect(unsubscribed).toHaveBeenCalledOnce();
    expect(aborted).toHaveBeenCalledOnce();
  });
});
