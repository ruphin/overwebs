import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-background.js";
import "../elements/overwebs-chat-widget.js";
import "../elements/overwebs-notification.js";
import { queueState, stopQueue } from "../lib/game-state.js";
import { installRouter, navigate, route } from "../lib/router.js";
import { logout, session } from "../lib/session.js";
import { OverwebsApp } from "./overwebs-app.js";
import type { OverwebsBackground } from "./overwebs-background.js";
import type { OverwebsChatWidget } from "./overwebs-chat-widget.js";
import type { OverwebsNotification } from "./overwebs-notification.js";

vi.mock("../lib/pages.js", () => {
  const page = (tag: string) => ({ tag, load: () => Promise.resolve() });
  return {
    pages: {
      login: page("overwebs-login-page"),
      main: page("overwebs-main-page"),
      play: page("overwebs-play-page"),
    },
  };
});

class StandInPage extends HTMLElement {
  selection?: unknown;
}

const define = (tag: string): void => {
  if (!customElements.get(tag)) {
    customElements.define(tag, class extends StandInPage {});
  }
};

/** Lets pending promises (page loading) and the resulting render complete. */
const settle = async (app: OverwebsApp): Promise<void> => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
  await app.updateComplete;
};

describe("overwebs-app", () => {
  let app: OverwebsApp;

  const root = () => app.renderRoot;
  const chat = () => root().querySelector<OverwebsChatWidget>("overwebs-chat-widget")!;
  const notification = () => root().querySelector<OverwebsNotification>("overwebs-notification");

  const create = async (): Promise<OverwebsApp> => {
    app = document.createElement("test-overwebs-app") as OverwebsApp;
    document.body.append(app);
    await settle(app);
    return app;
  };

  const loginAs = async (): Promise<void> => {
    app.dispatchEvent(
      new CustomEvent("login", { detail: { username: "Tester" }, bubbles: true, composed: true }),
    );
    await settle(app);
  };

  beforeAll(() => {
    customElements.define("test-overwebs-app", OverwebsApp);
    for (const tag of ["overwebs-login-page", "overwebs-main-page", "overwebs-play-page"]) {
      define(tag);
    }
    installRouter();
  });

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    logout();
    stopQueue();
    navigate("/", { replace: true });
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("redirects to the login page when not logged in and hides the chat", async () => {
    await create();
    expect(location.pathname).toBe("/login");
    expect(route.value.page).toBe("login");
    expect(app.page).toBe("login");
    expect(app.loggedIn).toBe(false);
    expect(root().querySelector("overwebs-login-page")).not.toBeNull();
    expect(root().querySelector("overwebs-main-page")).toBeNull();
    expect(chat().hidden).toBe(true);
  });

  it("renders the background with the selection and the page", async () => {
    await create();
    const background = root().querySelector<OverwebsBackground>("overwebs-background")!;
    expect(app.selection).toBeDefined();
    expect(background.backgrounds).toBe(app.selection!.backgrounds);
    expect(background.page).toBe("login");
  });

  it("logs in on a login event and shows the main page with the selection", async () => {
    await create();
    await loginAs();
    expect(session.value).toBe("Tester");
    expect(app.loggedIn).toBe(true);
    expect(location.pathname).toBe("/main");
    expect(app.page).toBe("main");
    expect(root().querySelector("overwebs-login-page")).toBeNull();
    const main = root().querySelector<StandInPage>("overwebs-main-page")!;
    expect(main).not.toBeNull();
    expect(main.selection).toBe(app.selection);
    expect(chat().hidden).toBe(false);
  });

  it("restores a stored session and goes to the main page", async () => {
    localStorage.setItem("userID", "Stored");
    await create();
    expect(app.loggedIn).toBe(true);
    expect(location.pathname).toBe("/main");
    expect(root().querySelector("overwebs-main-page")).not.toBeNull();
  });

  it("keeps the same page element while the page stays the same", async () => {
    await create();
    await loginAs();
    const main = root().querySelector("overwebs-main-page");
    app.requestUpdate();
    await app.updateComplete;
    expect(root().querySelector("overwebs-main-page")).toBe(main);
  });

  it("selects the background set from ?background and replaces the route with /main", async () => {
    await create();
    await loginAs();
    navigate("/main?background=tracer");
    await settle(app);
    expect(app.selection!.hero).toBe("tracer");
    expect(location.pathname + location.search).toBe("/main");
    expect(root().querySelector<StandInPage>("overwebs-main-page")!.selection).toBe(app.selection);
  });

  it("sends unknown pages to /main", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await create();
    await loginAs();
    navigate("/nowhere");
    await settle(app);
    expect(warn).toHaveBeenCalled();
    expect(location.pathname).toBe("/main");
    expect(app.page).toBe("main");
  });

  it("renders other pages after loading them", async () => {
    await create();
    await loginAs();
    navigate("/play");
    await settle(app);
    expect(app.page).toBe("play");
    expect(root().querySelector("overwebs-play-page")).not.toBeNull();
    expect(root().querySelector("overwebs-main-page")).toBeNull();
  });

  it("shows the queue notification with a ticking elapsed time and cancels it", async () => {
    vi.useFakeTimers();
    await create();
    await loginAs();
    expect(notification()).toBeNull();

    app.dispatchEvent(
      new CustomEvent("queue", { detail: { type: "Quick Play" }, bubbles: true, composed: true }),
    );
    await app.updateComplete;
    expect(queueState.value).toMatchObject({ queued: true, type: "Quick Play" });
    const shown = notification()!;
    expect(shown).not.toBeNull();
    expect(shown.spinner).toBe(true);
    expect(shown.action).toBe("Cancel Search");
    expect(shown.textContent).toContain("Searching for game");
    expect(shown.textContent).toContain("Estimated time: 1:42");
    expect(shown.textContent).toContain("Elapsed time: 0:00");

    vi.advanceTimersByTime(3000);
    await app.updateComplete;
    expect(notification()!.textContent).toContain("Elapsed time: 0:03");

    shown.dispatchEvent(new CustomEvent("action", { bubbles: true, composed: true }));
    await app.updateComplete;
    expect(queueState.value.queued).toBe(false);
    expect(notification()).toBeNull();
    expect(vi.getTimerCount()).toBeLessThanOrEqual(1); // Only the chat introduction timer may remain
  });

  it("stops the elapsed timer on disconnect", async () => {
    vi.useFakeTimers();
    await create();
    await loginAs();
    app.dispatchEvent(new CustomEvent("queue", { detail: { type: "Arcade" } }));
    app.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders a black link home on the exit page", async () => {
    await create();
    await loginAs();
    navigate("/exit");
    await settle(app);
    const exit = root().querySelector<HTMLAnchorElement>("a#exit")!;
    expect(exit).not.toBeNull();
    expect(exit.getAttribute("href")).toBe("/");
    expect(root().querySelector("overwebs-main-page")).toBeNull();
  });
});
