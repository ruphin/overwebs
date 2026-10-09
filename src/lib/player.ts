import { Store } from "./store.js";

export type PlayerStatus = "available" | "away" | "busy";

export interface Player {
  readonly name: string;
  readonly level: number;
  /** The id of the avatar image under `/avatars/`. */
  readonly avatar: string;
  readonly status: PlayerStatus;
  /** The number of unlocked cosmetics per hero id. */
  readonly unlocks: Readonly<Record<string, number>>;
}

/** The demo player profile. The name is replaced by the login name, see `session.ts`. */
export const defaultPlayer: Player = {
  name: "Ruphin",
  level: 142,
  avatar: "0x02500000000008E8",
  status: "available",
  unlocks: {
    ana: 12,
    bastion: 47,
    dva: 24,
    genji: 42,
    hanzo: 36,
    junkrat: 18,
    lucio: 46,
    mccree: 12,
    mei: 25,
    mercy: 7,
    orisa: 12,
    pharah: 17,
    reaper: 39,
    reinhardt: 10,
    roadhog: 32,
    soldier76: 33,
    symmetra: 15,
    torbjorn: 17,
    tracer: 27,
    widowmaker: 25,
    winston: 46,
    zarya: 18,
    zenyatta: 51,
    sombra: 37,
  },
};

/** The current player. Subscribe to follow changes. */
export const player = new Store<Player>(defaultPlayer);

/** The URL of an avatar image. */
export const avatarUrl = (avatar: string): string => `/avatars/${avatar}.png`;

/** The level shown in the player widget: levels wrap every 100. */
export const displayLevel = (level: number): number => (level > 0 ? ((level - 1) % 100) + 1 : 0);

/** The number of prestige stars: one per 100 levels, reset every 600. */
export const prestigeStars = (level: number): number =>
  level > 0 ? Math.trunc(((level % 600) - 1) / 100) : 0;

export type PrestigeRank = "bronze" | "silver" | "gold";

/** The prestige rank (border colour) of a level: bronze below 600, silver below 1200, gold after. */
export const prestigeRank = (level: number): PrestigeRank =>
  (["bronze", "silver", "gold"] as const)[Math.min(2, Math.trunc(level / 600))]!;
