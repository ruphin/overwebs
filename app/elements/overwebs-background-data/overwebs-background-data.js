Polymer({
  is: 'overwebs-background-data',
  properties: {
    backgrounds: {
      type: Object,
      notify: true,
      readOnly: true,
      value: {
        eichenwalde: {
          roadhog: {
            main_in: {
              transition: "main",
              preload: ["play_in", "gallery_in"],
            },
            main: {
              preload: ["play_in", "gallery_in"],
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
            },
            play: {
              preload: ["play_out"],
            },
            play_out: {
              transition: 'main',
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
            },
            gallery: {
              preload: ["gallery_out"],
            },
            gallery_out: {
              transition: 'main',
            },
          }
        },
        hanamura: {
          reaper: {
            main_in: {
              transition: "main",
              preload: ["play_in", "gallery_in"],
            },
            main: {
              preload: ["play_in", "gallery_in"],
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
            },
            play: {
              preload: ["play_out"],
            },
            play_out: {
              transition: 'main',
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
            },
            gallery: {
              preload: ["gallery_out"],
            },
            gallery_out: {
              transition: 'main',
            },
          }
        },
        kings_row: {
          reinhardt: {
            main_in: {
              transition: "main",
              preload: ["play_in", "gallery_in"],
            },
            main: {
              preload: ["play_in", "gallery_in"],
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
            },
            play: {
              preload: ["play_out"],
            },
            play_out: {
              transition: 'main',
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
            },
            gallery: {
              preload: ["gallery_out"],
            },
            gallery_out: {
              transition: 'main',
            },
          }
        },
        temple_of_anubis: {
          dva: {
            main_in: {
              transition: "main",
              preload: ["play_in", "gallery_in"],
            },
            main: {
              preload: ["play_in", "gallery_in"],
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
            },
            play: {
              preload: ["play_out"],
            },
            play_out: {
              transition: 'main',
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
            },
            gallery: {
              preload: ["gallery_out"],
            },
            gallery_out: {
              transition: 'main',
            },
          }
        }
      }
    }
  }
});
