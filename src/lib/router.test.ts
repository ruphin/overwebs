import { afterEach, describe, expect, it } from "vitest";
import { installRouter, navigate, route } from "./router.js";

const controller = new AbortController();
installRouter({ signal: controller.signal });

afterEach(() => {
  navigate("/", { replace: true });
  document.body.innerHTML = "";
});

describe("router", () => {
  it("exposes the page and params of the location", () => {
    navigate("/main?background=tracer");
    expect(route.value.page).toBe("main");
    expect(route.value.params.get("background")).toBe("tracer");
    expect(location.pathname).toBe("/main");
  });

  it("follows same-origin link clicks, through shadow roots", () => {
    const host = document.createElement("div");
    host.attachShadow({ mode: "open" }).innerHTML = `<a href="/play"><span>Play</span></a>`;
    document.body.append(host);
    host.shadowRoot!.querySelector("span")!.click();
    expect(route.value.page).toBe("play");
  });
});
