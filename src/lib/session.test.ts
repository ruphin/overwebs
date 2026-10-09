import { beforeEach, describe, expect, it } from "vitest";
import { player } from "./player.js";
import { displayName, login, logout, restoreSession, session, userIdFor } from "./session.js";

beforeEach(() => {
  localStorage.clear();
  logout();
});

describe("session", () => {
  it("builds user ids like the original", () => {
    expect(userIdFor({ username: "Tracer" })).toBe("Tracer");
    expect(userIdFor({ username: "Tracer", battleTag: "1234" })).toBe("Tracer-1234");
    expect(userIdFor({ anonymous: true })).toMatch(/^Anonymous-[a-z0-9]+$/);
  });

  it("derives the display name from the user id", () => {
    expect(displayName("Tracer-1234")).toBe("Tracer");
    expect(displayName("Anonymous-abc")).toBe("Anonymous");
  });

  it("logs in, renames the player and persists the session", () => {
    const userId = login({ username: "Tracer", battleTag: "1234" });
    expect(session.value).toBe(userId);
    expect(player.value.name).toBe("Tracer");
    expect(localStorage.getItem("userID")).toBe("Tracer-1234");
  });

  it("restores a stored session", () => {
    localStorage.setItem("userID", "Genji-42");
    expect(restoreSession()).toBe("Genji-42");
    expect(session.value).toBe("Genji-42");
    expect(player.value.name).toBe("Genji");
  });

  it("logs out", () => {
    login({ anonymous: true });
    logout();
    expect(session.value).toBeNull();
    expect(localStorage.getItem("userID")).toBeNull();
  });
});
