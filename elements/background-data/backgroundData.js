const transitions = {
  login: {
    transitions: ["main"],
  },
  main: {
    transitions: ["gallery", "play", "training"],
  },
  play: {
    transitions: ["main", "competitive", "vs-ai", "arcade"],
    shared: true,
  },
  training: {
    mirror: "play",
  },
  competitive: {
    transitions: ["play"],
    shared: true,
  },
  "vs-ai": {
    mirror: "competitive",
  },
  arcade: {
    mirror: "competitive",
  },
  gallery: {
    transitions: ["main"],
    shared: true,
  },
};

const availableBackgrounds = {
  halloween: ["reaper", "mercy"],
  hollywood: ["tracer", "bastion"],
  volskaya: ["widowmaker", "soldier76", "genji"],
  gibraltar: ["winston", "sombra"],
  eichenwalde: ["mccree", "roadhog"],
  hanamura: ["reaper", "sombra"],
  kings_row: ["reinhardt"],
  temple_of_anubis: ["dva", "pharah"],
};

export const backgroundSets = [];
for (const map in availableBackgrounds) {
  availableBackgrounds[map].forEach((hero) => backgroundSets.push([map, hero]));
}

export const backgroundData = ([map, hero], originScene, targetScene) => {
  const target = transitions[targetScene].mirror || targetScene;
  const heroPath = transitions[target].shared ? "shared/" : `${hero}/`;
  const preload = transitions[target].transitions
    .filter((transition) => !transitions[transition].mirror)
    .map((transition) => {
      const transitionTarget = transitions[transition].mirror || transition;
      const heroPath = transitions[transitionTarget].shared
        ? "shared/"
        : `${hero}/`;
      return relativeUrl(
        `${map}/${heroPath}${target}_to_${transitionTarget}.mp4`
      );
    });

  if (targetScene === "login") {
    return { image: relativeUrl("shared/login.jpg"), preload };
  }

  const source = transitions[originScene]?.mirror || originScene;
  const transition = relativeUrl(
    `${map}/${heroPath}${source}_to_${target}.mp4`
  );
  const transitionId = `${source}_to_${target}`;
  const loop = relativeUrl(`${map}/${heroPath}${target}.mp4`);
  const loopId = `${target}`;
  const image = relativeUrl(`${map}/${heroPath}${target}.jpg`);

  return { image, transition, transitionId, loop, loopId, preload };
};

const relativeUrl = (path) => {
  const { url } = import.meta;
  return `${url.substring(0, url.lastIndexOf("/"))}/${path}`;
};
