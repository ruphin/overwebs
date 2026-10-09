/**
 * The login session. Replaces the Firebase authentication of the original:
 * the user id is kept in `localStorage` and the player name is derived from it.
 */
import { player } from "./player.js";
import { Store } from "./store.js";

export type LoginRequest = { anonymous: true } | { username: string; battleTag?: string };

const STORAGE_KEY = "userID";

const storedUserId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/** Builds the user id for a login request, in the format the original used. */
export const userIdFor = (request: LoginRequest): string => {
  if ("anonymous" in request) {
    return `Anonymous-${Math.random().toString(36).slice(2, 8)}`;
  }
  return request.battleTag ? `${request.username}-${request.battleTag}` : request.username;
};

/** The display name of a user id: the part before the first dash. */
export const displayName = (userId: string): string => userId.split("-")[0] ?? userId;

/** The id of the logged in user, or `null` when nobody is logged in. */
export const session = new Store<string | null>(null);

session.subscribe((userId) => {
  if (userId !== null) {
    player.update((current) => ({ ...current, name: displayName(userId) }));
  }
});

/** Logs in with the given request and returns the user id. */
export const login = (request: LoginRequest): string => {
  const userId = userIdFor(request);
  try {
    localStorage.setItem(STORAGE_KEY, userId);
  } catch {
    // Storage is unavailable (private mode, blocked). The session still works for this page load.
  }
  session.set(userId);
  return userId;
};

export const logout = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to remove
  }
  session.set(null);
};

/** Restores a previous login from storage. Returns the user id, or `null`. */
export const restoreSession = (): string | null => {
  const userId = storedUserId();
  session.set(userId);
  return userId;
};
