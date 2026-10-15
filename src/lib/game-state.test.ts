import { describe, expect, it } from "vitest";
import {
  DEFAULT_ACCENT,
  formatElapsed,
  queueEvent,
  queueState,
  startQueue,
  stopQueue,
} from "./game-state.js";

describe("queue", () => {
  it("starts and stops", () => {
    startQueue("Quick Play");
    expect(queueState.value).toMatchObject({
      queued: true,
      type: "Quick Play",
      accent: DEFAULT_ACCENT,
    });
    stopQueue();
    expect(queueState.value).toEqual({ queued: false });
  });

  it("stores the accent of the queue", () => {
    startQueue("Mystery Duel", "#0ea44c");
    expect(queueState.value).toMatchObject({ type: "Mystery Duel", accent: "#0ea44c" });
    stopQueue();
  });

  it("builds a bubbling, composed queue event", () => {
    const event = queueEvent({ type: "Custom Game", accent: "#d13a1c" });
    expect(event.type).toBe("queue");
    expect(event.detail).toEqual({ type: "Custom Game", accent: "#d13a1c" });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("formats elapsed time as m:ss", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(5000)).toBe("0:05");
    expect(formatElapsed(102_000)).toBe("1:42");
    expect(formatElapsed(-1)).toBe("0:00");
  });
});
