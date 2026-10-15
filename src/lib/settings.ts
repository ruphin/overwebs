/**
 * The player's settings, from the options page, kept in `localStorage`.
 *
 * Until a setting is changed its default applies, which may depend on the
 * device: animated backgrounds are off where the device prefers saving data.
 */
import { Store } from "./store.js";

export interface Settings {
  /** Play the background videos, instead of showing their poster images. */
  readonly animatedBackgrounds: boolean;
  /** Share chat messages through the chat server, instead of keeping them local. */
  readonly onlineChat: boolean;
}

const STORAGE_KEY = "settings";

/** Whether the device prefers saving data: data saver on, or a touch-only device. */
export const prefersLowBandwidth = (): boolean => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData === true) {
    return true;
  }
  return (
    typeof matchMedia === "function" && matchMedia("(hover: none) and (pointer: coarse)").matches
  );
};

const defaults = (): Settings => ({
  animatedBackgrounds: !prefersLowBandwidth(),
  onlineChat: true,
});

/** Reads the stored settings, with the defaults for whatever is not stored. */
export const loadSettings = (): Settings => {
  const result: { -readonly [K in keyof Settings]: Settings[K] } = { ...defaults() };
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (stored && typeof stored === "object") {
      const values = stored as Partial<Record<keyof Settings, unknown>>;
      for (const key of Object.keys(result) as (keyof Settings)[]) {
        if (typeof values[key] === "boolean") {
          result[key] = values[key];
        }
      }
    }
  } catch {
    // Storage is unavailable or holds something else; the defaults apply
  }
  return result;
};

/** The current settings. Subscribe to follow changes. */
export const settings = new Store<Settings>(loadSettings());

/** Changes settings and stores them. */
export const updateSettings = (changes: Partial<Settings>): void => {
  settings.update((current) => ({ ...current, ...changes }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  } catch {
    // Storage is unavailable (private mode, blocked); the change holds for this page load
  }
};
