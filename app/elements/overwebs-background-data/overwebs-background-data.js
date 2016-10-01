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
              fallback: "main"
            },
            main: {
              preload: ["play_in", "gallery_in"],
              fallback: "main"
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
              fallback: "play"
            },
            play: {
              preload: ["play_out"],
              fallback: "play"
            },
            play_out: {
              transition: 'main',
              fallback: "main"
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
              fallback: "gallery"
            },
            gallery: {
              preload: ["gallery_out"],
              fallback: "gallery"
            },
            gallery_out: {
              transition: 'main',
              fallback: "main"
            },
          }
        },
        temple_of_anubis: {
          dva: {
            main_in: {
              transition: "main",
              preload: ["play_in", "gallery_in"],
              fallback: "main"
            },
            main: {
              preload: ["play_in", "gallery_in"],
              fallback: "main"
            },
            play_in: {
              transition: "play",
              preload: ["play_out"],
              fallback: "play"
            },
            play: {
              preload: ["play_out"],
              fallback: "play"
            },
            play_out: {
              transition: 'main',
              fallback: "main"
            },
            gallery_in: {
              transition: 'gallery',
              preload: ["gallery_out"],
              fallback: "gallery"
            },
            gallery: {
              preload: ["gallery_out"],
              fallback: "gallery"
            },
            gallery_out: {
              transition: 'main',
              fallback: "main"
            },
          }
        }
      }
    }
  }
});
