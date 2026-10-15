import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiChatHandler } from "./chat-api.js";
import type { ChatMessage } from "./chat.js";

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

const deferred = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

interface Call {
  url: string;
  init: RequestInit | undefined;
  reply: Deferred<Response>;
}

/** A fetch whose calls are recorded and answered by the test. */
const fakeFetch = () => {
  const calls: Call[] = [];
  const fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const reply = deferred<Response>();
    calls.push({ url: String(input), init, reply });
    return reply.promise;
  });
  return { calls, fetch: fetch as unknown as typeof globalThis.fetch };
};

const respond = (status: number, body: unknown): Response =>
  ({ ok: status < 300, status, json: async () => body }) as Response;

/** Lets the handler's promise chains run. */
const flush = async () => {
  for (let i = 0; i < 8; i++) {
    await Promise.resolve();
  }
};

/** A document whose visibility the test controls. */
const fakeDocument = () => Object.assign(new EventTarget(), { hidden: false });

const server = (id: number, author: string, body: string) => ({
  id,
  time: id * 1000,
  author,
  body,
});

const shown = (id: number, author: string, message: string): ChatMessage => ({
  id,
  author,
  channel: "General",
  message,
  timestamp: id * 1000,
});

const start = (options: { document?: ReturnType<typeof fakeDocument> } = {}) => {
  const { calls, fetch } = fakeFetch();
  const handler = new ApiChatHandler({ url: "/chat", fetch, document: options.document });
  const listener = vi.fn();
  handler.subscribe(listener);
  const controller = new AbortController();
  handler.connect(controller.signal);
  return { calls, handler, listener, controller };
};

afterEach(() => {
  vi.useRealTimers();
});

describe("ApiChatHandler", () => {
  it("loads the history, then polls from the newest id", async () => {
    const { calls, listener, controller } = start();
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("/chat");
    calls[0]!.reply.resolve(
      respond(200, { last: 2, messages: [server(1, "Ana", "one"), server(2, "Mei", "two")] }),
    );
    await flush();
    expect(listener.mock.calls.map(([message]) => message)).toEqual([
      shown(1, "Ana", "one"),
      shown(2, "Mei", "two"),
    ]);
    expect(calls).toHaveLength(2);
    expect(calls[1]!.url).toBe("/chat?since=2");

    calls[1]!.reply.resolve(respond(200, { last: 3, messages: [server(3, "Ana", "three")] }));
    await flush();
    expect(listener).toHaveBeenCalledTimes(3);
    expect(listener).toHaveBeenLastCalledWith(shown(3, "Ana", "three"));
    expect(calls[2]!.url).toBe("/chat?since=3");

    controller.abort();
    expect(calls[2]!.init?.signal?.aborted).toBe(true);
    calls[2]!.reply.reject(new Error("aborted"));
    await flush();
    expect(calls).toHaveLength(3);
  });

  it("posts sent messages and shows the server's copy once", async () => {
    const { calls, handler, listener } = start();
    calls[0]!.reply.resolve(respond(200, { last: 0, messages: [] }));
    await flush();

    const sending = handler.send("Tracer", "General", "Cheers love");
    const post = calls[2]!;
    expect(post.init?.method).toBe("POST");
    expect(JSON.parse(String(post.init?.body))).toEqual({ author: "Tracer", body: "Cheers love" });
    post.reply.resolve(respond(201, server(7, "Tracer", "Cheers love")));
    await sending;
    expect(listener).toHaveBeenCalledWith(shown(7, "Tracer", "Cheers love"));

    calls[1]!.reply.resolve(
      respond(200, { last: 7, messages: [server(7, "Tracer", "Cheers love")] }),
    );
    await flush();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("tells the player when a post is refused or fails", async () => {
    const { calls, handler, listener } = start();
    calls[0]!.reply.resolve(respond(200, { last: 0, messages: [] }));
    await flush();

    let sending = handler.send("Tracer", "General", "spam");
    calls[2]!.reply.resolve(respond(429, { error: "fast", retryAfter: 1 }));
    await sending;
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ author: "System", message: expect.stringContaining("Slow down") }),
    );

    sending = handler.send("Tracer", "General", "again");
    calls[3]!.reply.reject(new TypeError("Failed to fetch"));
    await sending;
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        author: "System",
        message: expect.stringContaining("unreachable"),
      }),
    );
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("retries a failed poll after a growing delay", async () => {
    vi.useFakeTimers();
    const { calls, controller } = start();
    calls[0]!.reply.reject(new TypeError("Failed to fetch"));
    await flush();
    expect(calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(calls).toHaveLength(2);
    calls[1]!.reply.resolve(respond(500, {}));
    await flush();
    await vi.advanceTimersByTimeAsync(1_999);
    expect(calls).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toHaveLength(3);
    controller.abort();
  });

  it("pauses while the page is hidden and resumes from the cursor", async () => {
    const document = fakeDocument();
    const { calls, controller } = start({ document });
    calls[0]!.reply.resolve(respond(200, { last: 4, messages: [] }));
    await flush();
    expect(calls).toHaveLength(2);

    document.hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(calls[1]!.init?.signal?.aborted).toBe(true);
    calls[1]!.reply.reject(new Error("aborted"));
    await flush();
    expect(calls).toHaveLength(2);

    document.hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await flush();
    expect(calls).toHaveLength(3);
    expect(calls[2]!.url).toBe("/chat?since=4");
    controller.abort();
  });
});
