import { describe, expect, it } from "vitest";
import { formatElapsed, queueState, startQueue, stopQueue } from "./game-state.js";

describe("queue", () => {
  it("starts and stops", () => {
    startQueue("Quick Play");
    expect(queueState.value).toMatchObject({ queued: true, type: "Quick Play" });
    stopQueue();
    expect(queueState.value).toEqual({ queued: false });
  });

  it("formats elapsed time as m:ss", () => {
    expect(formatElapsed(0)).toBe("0:00");
    expect(formatElapsed(5000)).toBe("0:05");
    expect(formatElapsed(102_000)).toBe("1:42");
    expect(formatElapsed(-1)).toBe("0:00");
  });
});
