import { afterEach, describe, expect, it, vi } from "vitest";
import "../elements/overwebs-login-page.js";
import type { LoginRequest } from "../lib/session.js";
import type { OverwebsButton } from "./overwebs-button.js";
import type { OverwebsLoginPage } from "./overwebs-login-page.js";

const create = async (): Promise<OverwebsLoginPage> => {
  const element = document.createElement("overwebs-login-page");
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const parts = (element: OverwebsLoginPage) => {
  const root = element.shadowRoot!;
  return {
    form: root.querySelector("form")!,
    input: root.querySelector("input")!,
    login: root.querySelector<OverwebsButton>("overwebs-button.login")!,
    anonymous: root.querySelector<OverwebsButton>("overwebs-button.anonymous")!,
  };
};

const type = async (element: OverwebsLoginPage, value: string) => {
  const { input } = parts(element);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await element.updateComplete;
};

const listen = () => {
  const listener = vi.fn<(event: CustomEvent<LoginRequest>) => void>();
  document.body.addEventListener("login", listener);
  return listener;
};

describe("overwebs-login-page", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders the label, the input and two yellow buttons", async () => {
    const element = await create();
    const { input, login, anonymous } = parts(element);
    expect(element.shadowRoot!.querySelector("label")?.textContent).toBe("Username");
    expect(input.getAttribute("pattern")).toBe("^([a-zA-Z]+(#[0-9]+)?)?$");
    expect(input.hasAttribute("autofocus")).toBe(true);
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(login.variant).toBe("yellow");
    expect(login.textContent).toBe("Login");
    expect(anonymous.variant).toBe("yellow");
    expect(anonymous.textContent).toBe("Anonymous");
  });

  it("enables Login only for a valid name and Anonymous only when empty", async () => {
    const element = await create();
    const { login, anonymous } = parts(element);
    expect(login.disabled).toBe(true);
    expect(anonymous.disabled).toBe(false);

    await type(element, "Tracer");
    expect(login.disabled).toBe(false);
    expect(anonymous.disabled).toBe(true);

    await type(element, "Tracer#12a");
    expect(login.disabled).toBe(true);
    expect(anonymous.disabled).toBe(true);

    await type(element, "");
    expect(login.disabled).toBe(true);
    expect(anonymous.disabled).toBe(false);
  });

  it("logs in with a username when Login is clicked", async () => {
    const element = await create();
    await type(element, "Tracer");
    const listener = listen();
    parts(element).login.click();
    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0]![0];
    expect(event.detail).toEqual({ username: "Tracer" });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("splits the battle tag on submit", async () => {
    const element = await create();
    await type(element, "Tracer#1234");
    const listener = listen();
    parts(element).form.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]![0].detail).toEqual({ username: "Tracer", battleTag: "1234" });
  });

  it("logs in anonymously when Anonymous is clicked with an empty field", async () => {
    const element = await create();
    const listener = listen();
    parts(element).anonymous.click();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]![0].detail).toEqual({ anonymous: true });
  });

  it("does not log in with an invalid name", async () => {
    const element = await create();
    await type(element, "Tracer#");
    const listener = listen();
    parts(element).form.dispatchEvent(new Event("submit", { cancelable: true }));
    parts(element).login.click();
    parts(element).anonymous.click();
    expect(listener).not.toHaveBeenCalled();
  });
});
