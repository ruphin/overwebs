/**
 * The hero roster. Static data; `background` marks heroes that have a set of
 * main menu background videos under `/backgrounds/<map>/<hero>/`.
 */
export interface Hero {
  readonly id: string;
  readonly name: string;
  /** The number of cosmetic unlocks the hero has in the hero gallery. */
  readonly unlockable: number;
  /** The accent colour of the hero, used for the unlock progress bar. */
  readonly color: string;
  /** Whether the hero has main menu backgrounds. */
  readonly background: boolean;
}

export const heroes: readonly Hero[] = [
  { id: "ana", name: "Ana", unlockable: 73, color: "#708AB3", background: false },
  { id: "bastion", name: "Bastion", unlockable: 73, color: "#7C907B", background: true },
  { id: "dva", name: "D.Va", unlockable: 73, color: "#F095CA", background: true },
  { id: "genji", name: "Genji", unlockable: 70, color: "#97F044", background: true },
  { id: "hanzo", name: "Hanzo", unlockable: 69, color: "#BAB48A", background: false },
  { id: "junkrat", name: "Junkrat", unlockable: 73, color: "#E9BD51", background: false },
  { id: "lucio", name: "Lúcio", unlockable: 73, color: "#85CA53", background: false },
  { id: "mccree", name: "McCree", unlockable: 71, color: "#B05A5D", background: true },
  { id: "mei", name: "Mei", unlockable: 76, color: "#6DABEC", background: false },
  { id: "mercy", name: "Mercy", unlockable: 73, color: "#ECEABD", background: false },
  { id: "orisa", name: "Orisa", unlockable: 55, color: "#448A42", background: false },
  { id: "pharah", name: "Pharah", unlockable: 73, color: "#3C7BC6", background: true },
  { id: "reaper", name: "Reaper", unlockable: 73, color: "#7E3F52", background: true },
  { id: "reinhardt", name: "Reinhardt", unlockable: 74, color: "#94A0A6", background: false },
  { id: "roadhog", name: "Roadhog", unlockable: 74, color: "#B58C51", background: true },
  { id: "soldier76", name: "Soldier: 76", unlockable: 72, color: "#6A7894", background: true },
  { id: "sombra", name: "Sombra", unlockable: 67, color: "#765CB9", background: true },
  { id: "symmetra", name: "Symmetra", unlockable: 72, color: "#90BDD0", background: false },
  { id: "torbjorn", name: "Torbjörn", unlockable: 72, color: "#C27670", background: false },
  { id: "tracer", name: "Tracer", unlockable: 74, color: "#D89342", background: true },
  { id: "widowmaker", name: "Widowmaker", unlockable: 72, color: "#9E6AA7", background: true },
  { id: "winston", name: "Winston", unlockable: 72, color: "#A1A6BD", background: true },
  { id: "zarya", name: "Zarya", unlockable: 72, color: "#EA80B7", background: false },
  { id: "zenyatta", name: "Zenyatta", unlockable: 72, color: "#EEE783", background: false },
];

export const heroById: ReadonlyMap<string, Hero> = new Map(heroes.map((hero) => [hero.id, hero]));

/** The URL of the hero gallery portrait of a hero. */
export const heroPortrait = (id: string): string => `/heroes/${id}.jpg`;
