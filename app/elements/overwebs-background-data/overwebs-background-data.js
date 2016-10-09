let backgroundSets = {
  eichenwalde: {
    roadhog: {
      to_main: {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      main: {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
      },
      play: {
        preload: ['play_to_main'],
      },
      play_to_main: {
        transition: 'main',
      },
      to_training: {
        mirror: 'to_play'
      },
      training: {
        mirror: 'training'
      },
      training_to_main: {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
    }
  },
  hanamura: {
    reaper: {
      to_main: {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      main: {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
      },
      play: {
        preload: ['play_to_main'],
      },
      play_to_main: {
        transition: 'main',
      },
      to_training: {
        mirror: 'to_play'
      },
      training: {
        mirror: 'training'
      },
      training_to_main: {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
    }
  },
  kings_row: {
    reinhardt: {
      to_main: {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      main: {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
      },
      play: {
        preload: ['play_to_main'],
      },
      play_to_main: {
        transition: 'main',
      },
      to_training: {
        mirror: 'to_play'
      },
      training: {
        mirror: 'training'
      },
      training_to_main: {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
    }
  },
  temple_of_anubis: {
    dva: {
      to_main: {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      main: {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
      },
      play: {
        preload: ['play_to_main'],
      },
      play_to_main: {
        transition: 'main',
      },
      to_training: {
        mirror: 'to_play'
      },
      training: {
        mirror: 'training'
      },
      training_to_main: {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
    }
  },
}

Polymer({
  is: 'overwebs-background-data',
  properties: {
    backgrounds: {
      type: Object,
      notify: true,
      readOnly: true,
      value: {},
    },
    backgroundSelection: {
      type: Object,
      notify: true,
      readOnly: true,
    },
    select: {
      type: String,
    }
  },

  ready: function () {
    // index all possible backgroundSets
    let index = this._index(backgroundSets);

    // If we want to select a specific backgroundSet
    if (this.select) {
      // Treat `this.select` as a literal string to match
      let selectRegex = new RegExp(this.select.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // Limit our options to backgroundSets that match our selection
      index = index.filter((i) => { return selectRegex.test(i); })
    }

    // Choose a random background from the selected options
    let backgroundLocation = index[Math.floor(Math.random() * index.length)];

    // We weren't able to select anything
    if (!backgroundLocation) {
      console.warn("Could not select a backgroundSet");
      return;
    }

    // Remove the trailing slash
    this._setBackgroundSelection(backgroundLocation.split('/').slice(0, -1));

    // Get the data object from the backgroundSets
    let backgroundData = this.backgroundSelection.reduce((object, key) => { return object[key]; }, backgroundSets);

    // Ok, we have selected backgroundData. Now we need to dynamically attach
    // video source locations, if those have not been added yet
    for (let background in backgroundData) {
      // If the background already has defined a video or image,
      // Or if the background needs to mirror another one,
      // we don't have to do anything
      if (!backgroundData[background].mirror && !backgroundData[background].video && !backgroundData[background].image) {
        backgroundData[background].video = this.resolveUrl(backgroundLocation + background + '.mp4');
        backgroundData[background].image = this.resolveUrl(backgroundLocation + background + '.jpg');
      }
    }

    this._setBackgrounds(backgroundData);
  },

  _index: function (tree) {
    let result = [];
    for (let property in tree) {
      if (tree[property].transition || tree[property].preload) {
        return [''];
      }
      Array.prototype.push.apply(result, this._index(tree[property]).map((item) => { return property + '/' + item; }));
    }
    return result;
  }
});
