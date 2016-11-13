let backgroundSets = {
  // halloween: {
  //   reaper: {
  //     'to_main': {
  //       transition: 'main',
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'main': {
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'to_play': {
  //       transition: 'play',
  //       preload: ['play_to_main'],
  //       video: 'halloween/shared/to_play.mp4',
  //       image: 'halloween/shared/to_play.jpg',
  //     },
  //     'play': {
  //       preload: ['play_to_main'],
  //       video: 'halloween/shared/play.mp4',
  //       image: 'halloween/shared/play.jpg',
  //     },
  //     'play_to_main': {
  //       transition: 'main',
  //     },
  //     'to_training': {
  //       mirror: 'to_play'
  //     },
  //     'training': {
  //       mirror: 'training'
  //     },
  //     'training_to_main': {
  //       mirror: 'play_to_main'
  //     },
  //     'to_hero-gallery': {
  //       transition: 'hero-gallery',
  //       preload: ['hero-gallery_to_main'],
  //       video: 'halloween/shared/to_hero-gallery.mp4',
  //       image: 'halloween/shared/to_hero-gallery.jpg',
  //     },
  //     'hero-gallery': {
  //       preload: ['hero-gallery_to_main'],
  //       video: 'halloween/shared/hero-gallery.mp4',
  //       image: 'halloween/shared/hero-gallery.jpg',
  //     },
  //     'hero-gallery_to_main': {
  //       transition: 'main',
  //     },
  //   },
  //   mercy: {
  //     'to_main': {
  //       transition: 'main',
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'main': {
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'to_play': {
  //       transition: 'play',
  //       preload: ['play_to_main'],
  //       video: 'halloween/shared/to_play.mp4',
  //       image: 'halloween/shared/to_play.jpg',
  //     },
  //     'play': {
  //       preload: ['play_to_main'],
  //       video: 'halloween/shared/play.mp4',
  //       image: 'halloween/shared/play.jpg',
  //     },
  //     'play_to_main': {
  //       transition: 'main',
  //     },
  //     'to_training': {
  //       mirror: 'to_play'
  //     },
  //     'training': {
  //       mirror: 'training'
  //     },
  //     'training_to_main': {
  //       mirror: 'play_to_main'
  //     },
  //     'to_hero-gallery': {
  //       transition: 'hero-gallery',
  //       preload: ['hero-gallery_to_main'],
  //       video: 'halloween/shared/to_hero-gallery.mp4',
  //       image: 'halloween/shared/to_hero-gallery.jpg',
  //     },
  //     'hero-gallery': {
  //       preload: ['hero-gallery_to_main'],
  //       video: 'halloween/shared/hero-gallery.mp4',
  //       image: 'halloween/shared/hero-gallery.jpg',
  //     },
  //     'hero-gallery_to_main': {
  //       transition: 'main',
  //     },
  //   },
  // },
  hollywood: {
    // tracer: {
    //   'to_main': {
    //     transition: 'main',
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'main': {
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'to_play': {
    //     transition: 'play',
    //     preload: ['play_to_main'],
    //   },
    //   'play': {
    //     preload: ['play_to_main'],
    //   },
    //   'play_to_main': {
    //     transition: 'main',
    //   },
    //   'to_training': {
    //     mirror: 'to_play'
    //   },
    //   'training': {
    //     mirror: 'training'
    //   },
    //   'training_to_main': {
    //     mirror: 'play_to_main'
    //   },
    //   'to_hero-gallery': {
    //     transition: 'hero-gallery',
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery': {
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery_to_main': {
    //     transition: 'main',
    //   },
    // },
    bastion: {
      'to_main': {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      'main': {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
        video: 'hollywood/shared/to_play.mp4',
        image: 'hollywood/shared/to_play.jpg',
      },
      'play': {
        preload: ['play_to_main'],
        video: 'hollywood/shared/play.mp4',
        image: 'hollywood/shared/play.jpg',
      },
      'to_competitive': {
        transition: 'competitive',
        preload: ['competitive_to_play'],
        video: 'hollywood/shared/to_competitive.mp4',
        image: 'hollywood/shared/to_competitive.jpg',
      },
      'competitive': {
        preload: ['competitive_to_play'],
        video: 'hollywood/shared/competitive.mp4',
        image: 'hollywood/shared/competitive.jpg',
      },
      'competitive_to_play': {
        transition: ['play'],
        video: 'hollywood/shared/competitive_to_play.mp4',
        image: 'hollywood/shared/competitive_to_play.jpg',
      },
      'play_to_main': {
        transition: 'main',
      },
      'to_training': {
        mirror: 'to_play'
      },
      'training': {
        mirror: 'training'
      },
      'training_to_main': {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
        video: 'hollywood/shared/to_hero-gallery.mp4',
        image: 'hollywood/shared/to_hero-gallery.jpg',
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
        video: 'hollywood/shared/hero-gallery.mp4',
        image: 'hollywood/shared/hero-gallery.jpg',
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
      'to_vs-ai': {
        mirror: 'to_competitive'
      },
      'vs-ai': {
        mirror: 'competitive'
      },
      'vs-ai_to_play': {
        mirror: 'competitive_to_play'
      },
      'vs-ai_to_training': {
        mirror: 'competitive_to_play'
      },
    },
  },
  volskaya: {
    // widowmaker: {
    //   'to_main': {
    //     transition: 'main',
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'main': {
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'to_play': {
    //     transition: 'play',
    //     preload: ['play_to_main'],
    //   },
    //   'play': {
    //     preload: ['play_to_main'],
    //   },
    //   'play_to_main': {
    //     transition: 'main',
    //   },
    //   'to_training': {
    //     mirror: 'to_play'
    //   },
    //   'training': {
    //     mirror: 'training'
    //   },
    //   'training_to_main': {
    //     mirror: 'play_to_main'
    //   },
    //   'to_hero-gallery': {
    //     transition: 'hero-gallery',
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery': {
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery_to_main': {
    //     transition: 'main',
    //   },
    // },
    soldier76: {
      'to_main': {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      'main': {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
        video: 'volskaya/shared/to_play.mp4',
        image: 'volskaya/shared/to_play.jpg',
      },
      'play': {
        preload: ['play_to_main'],
        video: 'volskaya/shared/play.mp4',
        image: 'volskaya/shared/play.jpg',
      },
      'to_competitive': {
        transition: 'competitive',
        preload: ['competitive_to_play'],
        video: 'volskaya/shared/to_competitive.mp4',
        image: 'volskaya/shared/to_competitive.jpg',
      },
      'competitive': {
        preload: ['competitive_to_play'],
        video: 'volskaya/shared/competitive.mp4',
        image: 'volskaya/shared/competitive.jpg',
      },
      'competitive_to_play': {
        transition: ['play'],
        video: 'volskaya/shared/competitive_to_play.mp4',
        image: 'volskaya/shared/competitive_to_play.jpg',
      },
      'play_to_main': {
        transition: 'main',
      },
      'to_training': {
        mirror: 'to_play'
      },
      'training': {
        mirror: 'training'
      },
      'training_to_main': {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
        video: 'volskaya/shared/to_hero-gallery.mp4',
        image: 'volskaya/shared/to_hero-gallery.jpg',
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
        video: 'volskaya/shared/hero-gallery.mp4',
        image: 'volskaya/shared/hero-gallery.jpg',
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
      'to_vs-ai': {
        mirror: 'to_competitive'
      },
      'vs-ai': {
        mirror: 'competitive'
      },
      'vs-ai_to_play': {
        mirror: 'competitive_to_play'
      },
      'vs-ai_to_training': {
        mirror: 'competitive_to_play'
      },
    },
    genji: {
      'to_main': {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      'main': {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
        video: 'volskaya/shared/to_play.mp4',
        image: 'volskaya/shared/to_play.jpg',
      },
      'play': {
        preload: ['play_to_main'],
        video: 'volskaya/shared/play.mp4',
        image: 'volskaya/shared/play.jpg',
      },
      'to_competitive': {
        transition: 'competitive',
        preload: ['competitive_to_play'],
        video: 'volskaya/shared/to_competitive.mp4',
        image: 'volskaya/shared/to_competitive.jpg',
      },
      'competitive': {
        preload: ['competitive_to_play'],
        video: 'volskaya/shared/competitive.mp4',
        image: 'volskaya/shared/competitive.jpg',
      },
      'competitive_to_play': {
        transition: ['play'],
        video: 'volskaya/shared/competitive_to_play.mp4',
        image: 'volskaya/shared/competitive_to_play.jpg',
      },
      'play_to_main': {
        transition: 'main',
      },
      'to_training': {
        mirror: 'to_play'
      },
      'training': {
        mirror: 'training'
      },
      'training_to_main': {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
        video: 'volskaya/shared/to_hero-gallery.mp4',
        image: 'volskaya/shared/to_hero-gallery.jpg',
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
        video: 'volskaya/shared/hero-gallery.mp4',
        image: 'volskaya/shared/hero-gallery.jpg',
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
      'to_vs-ai': {
        mirror: 'to_competitive'
      },
      'vs-ai': {
        mirror: 'competitive'
      },
      'vs-ai_to_play': {
        mirror: 'competitive_to_play'
      },
      'vs-ai_to_training': {
        mirror: 'competitive_to_play'
      },
    },
  },
  gibraltar: {
    // winston: {
    //   'to_main': {
    //     transition: 'main',
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'main': {
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'to_play': {
    //     transition: 'play',
    //     preload: ['play_to_main'],
    //   },
    //   'play': {
    //     preload: ['play_to_main'],
    //   },
    //   'play_to_main': {
    //     transition: 'main',
    //   },
    //   'to_training': {
    //     mirror: 'to_play'
    //   },
    //   'training': {
    //     mirror: 'training'
    //   },
    //   'training_to_main': {
    //     mirror: 'play_to_main'
    //   },
    //   'to_hero-gallery': {
    //     transition: 'hero-gallery',
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery': {
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery_to_main': {
    //     transition: 'main',
    //   },
    // },
    sombra: {
      'to_main': {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      'main': {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
        video: 'gibraltar/shared/to_play.mp4',
        image: 'gibraltar/shared/to_play.jpg',
      },
      'play': {
        preload: ['play_to_main'],
        video: 'gibraltar/shared/play.mp4',
        image: 'gibraltar/shared/play.jpg',
      },
      'to_competitive': {
        transition: 'competitive',
        preload: ['competitive_to_play'],
        video: 'gibraltar/shared/to_competitive.mp4',
        image: 'gibraltar/shared/to_competitive.jpg',
      },
      'competitive': {
        preload: ['competitive_to_play'],
        video: 'gibraltar/shared/competitive.mp4',
        image: 'gibraltar/shared/competitive.jpg',
      },
      'competitive_to_play': {
        transition: ['play'],
        video: 'gibraltar/shared/competitive_to_play.mp4',
        image: 'gibraltar/shared/competitive_to_play.jpg',
      },
      'play_to_main': {
        transition: 'main',
      },
      'to_training': {
        mirror: 'to_play'
      },
      'training': {
        mirror: 'training'
      },
      'training_to_main': {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
        video: 'gibraltar/shared/to_hero-gallery.mp4',
        image: 'gibraltar/shared/to_hero-gallery.jpg',
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
        video: 'gibraltar/shared/hero-gallery.mp4',
        image: 'gibraltar/shared/hero-gallery.jpg',
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
      'to_vs-ai': {
        mirror: 'to_competitive'
      },
      'vs-ai': {
        mirror: 'competitive'
      },
      'vs-ai_to_play': {
        mirror: 'competitive_to_play'
      },
      'vs-ai_to_training': {
        mirror: 'competitive_to_play'
      },
    },
  },
  // eichenwalde: {
  //   roadhog: {
  //     'to_main': {
  //       transition: 'main',
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'main': {
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'to_play': {
  //       transition: 'play',
  //       preload: ['play_to_main'],
  //     },
  //     'play': {
  //       preload: ['play_to_main'],
  //     },
  //     'play_to_main': {
  //       transition: 'main',
  //     },
  //     'to_training': {
  //       mirror: 'to_play'
  //     },
  //     'training': {
  //       mirror: 'training'
  //     },
  //     'training_to_main': {
  //       mirror: 'play_to_main'
  //     },
  //     'to_hero-gallery': {
  //       transition: 'hero-gallery',
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery': {
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery_to_main': {
  //       transition: 'main',
  //     },
  //   }
  // },
  // hanamura: {
  //   reaper: {
  //     'to_main': {
  //       transition: 'main',
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'main': {
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'to_play': {
  //       transition: 'play',
  //       preload: ['play_to_main'],
  //     },
  //     'play': {
  //       preload: ['play_to_main'],
  //     },
  //     'play_to_main': {
  //       transition: 'main',
  //     },
  //     'to_training': {
  //       mirror: 'to_play'
  //     },
  //     'training': {
  //       mirror: 'training'
  //     },
  //     'training_to_main': {
  //       mirror: 'play_to_main'
  //     },
  //     'to_hero-gallery': {
  //       transition: 'hero-gallery',
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery': {
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery_to_main': {
  //       transition: 'main',
  //     },
  //   }
  // },
  // kings_row: {
  //   reinhardt: {
  //     'to_main': {
  //       transition: 'main',
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'main': {
  //       preload: ['to_play', 'to_hero-gallery'],
  //     },
  //     'to_play': {
  //       transition: 'play',
  //       preload: ['play_to_main'],
  //     },
  //     'play': {
  //       preload: ['play_to_main'],
  //     },
  //     'play_to_main': {
  //       transition: 'main',
  //     },
  //     'to_training': {
  //       mirror: 'to_play'
  //     },
  //     'training': {
  //       mirror: 'training'
  //     },
  //     'training_to_main': {
  //       mirror: 'play_to_main'
  //     },
  //     'to_hero-gallery': {
  //       transition: 'hero-gallery',
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery': {
  //       preload: ['hero-gallery_to_main'],
  //     },
  //     'hero-gallery_to_main': {
  //       transition: 'main',
  //     },
  //   }
  // },
  temple_of_anubis: {
    // dva: {
    //   'to_main': {
    //     transition: 'main',
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'main': {
    //     preload: ['to_play', 'to_hero-gallery'],
    //   },
    //   'to_play': {
    //     transition: 'play',
    //     preload: ['play_to_main'],
    //   },
    //   'play': {
    //     preload: ['play_to_main'],
    //   },
    //   'play_to_main': {
    //     transition: 'main',
    //   },
    //   'to_training': {
    //     mirror: 'to_play'
    //   },
    //   'training': {
    //     mirror: 'training'
    //   },
    //   'training_to_main': {
    //     mirror: 'play_to_main'
    //   },
    //   'to_hero-gallery': {
    //     transition: 'hero-gallery',
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery': {
    //     preload: ['hero-gallery_to_main'],
    //   },
    //   'hero-gallery_to_main': {
    //     transition: 'main',
    //   },
    // },
    pharah: {
      'to_main': {
        transition: 'main',
        preload: ['to_play', 'to_hero-gallery'],
      },
      'main': {
        preload: ['to_play', 'to_hero-gallery'],
      },
      'to_play': {
        transition: 'play',
        preload: ['play_to_main'],
        video: 'temple_of_anubis/shared/to_play.mp4',
        image: 'temple_of_anubis/shared/to_play.jpg',
      },
      'play': {
        preload: ['play_to_main'],
        video: 'temple_of_anubis/shared/play.mp4',
        image: 'temple_of_anubis/shared/play.jpg',
      },
      'to_competitive': {
        transition: 'competitive',
        preload: ['competitive_to_play'],
        video: 'temple_of_anubis/shared/to_competitive.mp4',
        image: 'temple_of_anubis/shared/to_competitive.jpg',
      },
      'competitive': {
        preload: ['competitive_to_play'],
        video: 'temple_of_anubis/shared/competitive.mp4',
        image: 'temple_of_anubis/shared/competitive.jpg',
      },
      'competitive_to_play': {
        transition: ['play'],
        video: 'temple_of_anubis/shared/competitive_to_play.mp4',
        image: 'temple_of_anubis/shared/competitive_to_play.jpg',
      },
      'play_to_main': {
        transition: 'main',
      },
      'to_training': {
        mirror: 'to_play'
      },
      'training': {
        mirror: 'training'
      },
      'training_to_main': {
        mirror: 'play_to_main'
      },
      'to_hero-gallery': {
        transition: 'hero-gallery',
        preload: ['hero-gallery_to_main'],
        video: 'temple_of_anubis/shared/to_hero-gallery.mp4',
        image: 'temple_of_anubis/shared/to_hero-gallery.jpg',
      },
      'hero-gallery': {
        preload: ['hero-gallery_to_main'],
        video: 'temple_of_anubis/shared/hero-gallery.mp4',
        image: 'temple_of_anubis/shared/hero-gallery.jpg',
      },
      'hero-gallery_to_main': {
        transition: 'main',
      },
    },
  },
}

Polymer({
  is: 'overwebs-background-data',
  properties: {
    backgrounds: {
      type: Object,
      notify: true,
      readOnly: true,
    },
    backgroundSelection: {
      type: String,
      notify: true,
      readOnly: true,
    },
    select: {
      type: String,
      observer: '_selectChanged'
    }
  },

  _selectChanged: function (value) {
    this._selectBackgrounds();
  },

  ready: function () {
    this._selectBackgrounds();
  },

  _selectBackgrounds() {
    // index all possible backgroundSets
    let index = this._index(backgroundSets);

    // If we want to select a specific backgroundSet
    if (this.select) {
      // Treat `this.select` as a literal string to match
      // let selectRegex = new RegExp(this.select.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      let selectRegex = new RegExp(this.select);
      // Limit our options to backgroundSets that match our selection
      index = index.filter((i) => { return selectRegex.test(i); });
    }

    // Choose a random background from the selected options
    this._setBackgroundSelection(index[Math.floor(Math.random() * index.length)]);

    // We weren't able to select anything
    if (!this.backgroundSelection) {
      console.warn("Could not select a backgroundSet");
      return;
    }

    // Get the data object from the backgroundSets
    let backgroundData = this.backgroundSelection.split('/').slice(0, -1).reduce((object, key) => { return object[key]; }, backgroundSets);

    // Ok, we have selected backgroundData. Now we need to dynamically attach
    // video source locations, if those have not been added yet
    for (let background in backgroundData) {
      // If the background needs to mirror another one,
      // we don't have to do anything
      if (!backgroundData[background].mirror) {
        // Use the given sources if they are defined, otherwise infer the source
        let backgroundVideo = backgroundData[background].video || `${this.backgroundSelection}${background}.mp4`;
        let backgroundImage = backgroundData[background].image || `${this.backgroundSelection}${background}.jpg`;
        backgroundData[background].video = this.resolveUrl(backgroundVideo);
        backgroundData[background].image = this.resolveUrl(backgroundImage);
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
