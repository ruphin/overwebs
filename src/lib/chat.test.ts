import { describe, expect, it, vi } from "vitest";
import { ChatEmitter, LocalChatHandler } from "./chat.js";

describe("ChatEmitter", () => {
  it("delivers emitted messages to subscribers", () => {
    const emitter = new ChatEmitter();
    const listener = vi.fn();
    emitter.subscribe(listener);
    const message = { author: "Ana", channel: "General", message: "hi", timestamp: 1 };
    emitter.emit(message);
    expect(listener).toHaveBeenCalledWith(message);
  });

  it("stops delivering after unsubscribe or abort", () => {
    const emitter = new ChatEmitter();
    const unsubscribed = vi.fn();
    const aborted = vi.fn();
    const controller = new AbortController();
    emitter.subscribe(unsubscribed)();
    emitter.subscribe(aborted, { signal: controller.signal });
    controller.abort();
    emitter.emit({ author: "Ana", channel: "General", message: "hi", timestamp: 1 });
    expect(unsubscribed).not.toHaveBeenCalled();
    expect(aborted).not.toHaveBeenCalled();
  });

  it("does not subscribe with an already aborted signal", () => {
    const emitter = new ChatEmitter();
    const listener = vi.fn();
    emitter.subscribe(listener, { signal: AbortSignal.abort() });
    emitter.emit({ author: "Ana", channel: "General", message: "hi", timestamp: 1 });
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("LocalChatHandler", () => {
  it("echoes sent messages to the player, timestamped now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    const handler = new LocalChatHandler();
    const listener = vi.fn();
    handler.subscribe(listener);
    handler.connect(new AbortController().signal);
    handler.send("Tracer", "General", "Cheers love");
    expect(listener).toHaveBeenCalledWith({
      author: "Tracer",
      channel: "General",
      message: "Cheers love",
      timestamp: 1_000,
    });
    vi.useRealTimers();
  });
});
