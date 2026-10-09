/**
 * The main menu background videos.
 *
 * A background set belongs to one map and one hero: the pages that show the
 * hero (`main`) use videos under `/backgrounds/<map>/<hero>/`, the other
 * pages use the shared videos of the map under `/backgrounds/<map>/shared/`.
 *
 * Every page of the application has a background. Navigating from one page to
 * another can play a transition video first: `<from>_to_<to>` when it exists,
 * otherwise `to_<to>`, otherwise the background of `<to>` directly. A
 * transition video plays once and then continues with its `transition` target,
 * which loops. See `overwebs-background` for the player.
 */

export interface Background {
  /** The video URL, or `undefined` for a still image. */
  readonly video?: string;
  /** The poster image URL. */
  readonly image: string;
  /** The background to continue with when this (transition) video ends. */
  readonly transition?: string;
  /** Backgrounds to start loading while this one shows. */
  readonly preload?: readonly string[];
}

/** The backgrounds of a set, by section name. Mirrored sections share one `Background` object. */
export type BackgroundSet = Readonly<Record<string, Background>>;

export interface BackgroundSelection {
  readonly map: string;
  readonly hero: string;
  readonly backgrounds: BackgroundSet;
}

/** The map and hero of every available background set. */
export const backgroundSets: readonly { map: string; hero: string }[] = [
  { map: "hollywood", hero: "tracer" },
  { map: "hollywood", hero: "bastion" },
  { map: "volskaya", hero: "widowmaker" },
  { map: "volskaya", hero: "soldier76" },
  { map: "volskaya", hero: "genji" },
  { map: "gibraltar", hero: "winston" },
  { map: "gibraltar", hero: "sombra" },
  { map: "eichenwalde", hero: "mccree" },
  { map: "eichenwalde", hero: "roadhog" },
  { map: "hanamura", hero: "reaper" },
  { map: "hanamura", hero: "sombra" },
  { map: "temple_of_anubis", hero: "dva" },
  { map: "temple_of_anubis", hero: "pharah" },
  // Available but not in rotation, as in the original:
  // { map: "halloween", hero: "reaper" },
  // { map: "halloween", hero: "mercy" },
  // { map: "kings_row", hero: "reinhardt" }, (all videos are hero specific)
];

export const LOGIN_BACKGROUND: Background = {
  image: "/backgrounds/shared/login.jpg",
  preload: ["to_main"],
};

/** Builds the background set of a map and hero. */
export const buildBackgroundSet = (map: string, hero: string): BackgroundSet => {
  const shared = (name: string, rest: Omit<Background, "video" | "image"> = {}): Background => ({
    video: `/backgrounds/${map}/shared/${name}.mp4`,
    image: `/backgrounds/${map}/shared/${name}.jpg`,
    ...rest,
  });
  const own = (name: string, rest: Omit<Background, "video" | "image"> = {}): Background => ({
    video: `/backgrounds/${map}/${hero}/${name}.mp4`,
    image: `/backgrounds/${map}/${hero}/${name}.jpg`,
    ...rest,
  });

  const toPlay = shared("to_play", { transition: "play", preload: ["play_to_main"] });
  const play = shared("play", { preload: ["play_to_main"] });
  const toCompetitive = shared("to_competitive", {
    transition: "competitive",
    preload: ["competitive_to_play"],
  });
  const competitive = shared("competitive", { preload: ["competitive_to_play"] });
  const competitiveToPlay = shared("competitive_to_play", { transition: "play" });
  const toHeroGallery = shared("to_hero-gallery", {
    transition: "hero-gallery",
    preload: ["hero-gallery_to_main"],
  });
  const heroGallery = shared("hero-gallery", { preload: ["hero-gallery_to_main"] });
  const toMain = own("to_main", { transition: "main", preload: ["to_play", "to_hero-gallery"] });
  const main = own("main", { preload: ["to_play", "to_hero-gallery"] });
  const playToMain = own("play_to_main", { transition: "main" });
  const heroGalleryToMain = own("hero-gallery_to_main", { transition: "main" });

  return {
    login: LOGIN_BACKGROUND,
    to_main: toMain,
    main,
    to_play: toPlay,
    to_training: toPlay,
    play,
    training: play,
    play_to_main: playToMain,
    training_to_main: playToMain,
    to_competitive: toCompetitive,
    to_arcade: toCompetitive,
    "to_vs-ai": toCompetitive,
    competitive,
    arcade: competitive,
    "vs-ai": competitive,
    competitive_to_play: competitiveToPlay,
    arcade_to_play: competitiveToPlay,
    "vs-ai_to_play": competitiveToPlay,
    "vs-ai_to_training": competitiveToPlay,
    "to_hero-gallery": toHeroGallery,
    "hero-gallery": heroGallery,
    "hero-gallery_to_main": heroGalleryToMain,
  };
};

/**
 * Picks a random background set. With `match`, only sets whose `<map>/<hero>`
 * contains it are considered (`"tracer"`, `"hollywood"`, `"hollywood/tracer"`).
 * Falls back to all sets when nothing matches.
 */
export const selectBackgrounds = (
  match?: string,
  random: () => number = Math.random,
): BackgroundSelection => {
  let candidates = backgroundSets;
  if (match) {
    const matching = backgroundSets.filter(({ map, hero }) => `${map}/${hero}`.includes(match));
    if (matching.length > 0) {
      candidates = matching;
    } else {
      console.warn(`No background set matches "${match}"`);
    }
  }
  const { map, hero } = candidates[Math.floor(random() * candidates.length)]!;
  return { map, hero, backgrounds: buildBackgroundSet(map, hero) };
};

/**
 * Finds the background to show when going from page `from` to page `to`:
 * `<from>_to_<to>`, then `to_<to>`, then `<to>`. Returns its section name.
 */
export const transitionFor = (set: BackgroundSet, from: string, to: string): string | undefined => {
  for (const name of [`${from}_to_${to}`, `to_${to}`, to]) {
    if (name in set) {
      return name;
    }
  }
  return undefined;
};
