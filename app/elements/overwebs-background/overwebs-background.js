Polymer({
  is: 'overwebs-background',
  properties: {
    backgroundData: {
      type: Object,
    },
    map: {
      type: String,
    },
    hero: {
      type: String,
    },
    lowBandwidth: {
      type: Boolean,
      value: false,
      observer: "_changeBandwidth",
    },
    page: {
      type: String,
      observer: "_loadPage",
    }
  },

  ready: function() {
    // Pick a random map if the map isn't chosen explicitly
    if (this.map === undefined) {
      let maps = Object.keys(this.backgroundData);
      this.map = maps[maps.length * Math.random() << 0];
    }
    // Pick a random hero if the hero isn't chosen explicitly
    if (this.hero === undefined) {
      let heroes = Object.keys(this.backgroundData[this.map]);
      this.hero = heroes[heroes.length * Math.random() << 0];
    }

    // The background Data we will be using
    this._backgroundData = this.backgroundData[this.map][this.hero]

    // Keep track of all backgrounds
    this._backgrounds = {}

    // Create a video element for each background video from the dataset
    Object.keys(this._backgroundData).forEach((section) => {
      let video = document.createElement('video');

      // If we're on low bandwidth, use a poster instead of a video
      if (this.lowBandwidth) {
        video.poster = this.resolveUrl(["./images", this.map, this.hero, this._backgroundData[section].fallback + ".jpg"].join("/"));
      } else {
        video.src = this.resolveUrl(["./videos", this.map, this.hero, section + ".mp4"].join("/"));
      }
      video.playsInline = true;
      video.preload = "none"
      video.id = section
      video.classList.add("hidden");
      Polymer.dom(this.root).appendChild(video);
      this._backgrounds[section] = video
    });
  },

  _changeBandwidth: function() {
    // Ignore any changes if we didn't load the backgrounds yet
    // It will be handled in the initalizer
    if (!this._backgrounds) {
      return;
    }
    Object.keys(this._backgroundData).forEach((section) => {
      let video = this._backgrounds[section]
      if (this.lowBandwidth) {
        video.poster = this.resolveUrl(["./images", this.map, this.hero, this._backgroundData[section].fallback + ".jpg"].join("/"));
        video.removeAttribute("src");
      } else {
        video.src = this.resolveUrl(["./videos", this.map, this.hero, section + ".mp4"].join("/"));
        video.removeAttribute("poster");
      }
    });
  },

  // This is probably not how we want to handle this.
  // We need some way to listen to what page we're going to
  // Perhaps individual pages should trigger events when they are opened?
  _loadPage: function (newPage, oldPage) {
    if (newPage === "") {
      switch (oldPage) {
        case undefined:
          newPage = "main_in";
          break;
        case "hero-gallery":
          newPage = "gallery_out";
          break;
        case "play":
          newPage = "play_out";
          break;
        case "training":
          newPage = "training_out";
          break;
      }
    }

    if (newPage === "hero-gallery") {
      newPage = "gallery_in"
    }
    if (newPage === "play") {
      newPage = "play_in"
    }

    this._transition(this._backgrounds[newPage]);
    this._previous = newPage
  },

  _transition: function (target) {
    // Hide the old background if we were showing one
    // Stop any pending transitions
    // And stop playing video
    if (this._currentlyShowing) {
      this._currentlyShowing.classList.add("hidden");
      this._currentlyShowing.removeEventListener("ended", this._listener);
      this._currentlyShowing.pause();
      this._currentlyShowing.loop = false;
      this._currentlyShowing.currentTime = 0;
    }

    // Show the new background
    target.classList.remove("hidden");

    this._currentlyShowing = target

    // Start playing the video we're transitioning to
    target.play();

    // Either set up a transition to the next section, or enable looping on the current video
    if (this._backgroundData[target.id].transition) {
      this._listener = () => { this._transition(this._backgrounds[this._backgroundData[target.id].transition]); };
      target.addEventListener("ended", this._listener);
    } else {
      this._listener = () => { target.play(); target.addEventListener("ended", this._listener); };
      target.addEventListener("ended", this._listener);
    }

    // Preload the videos we can possibly transition to afterwards
    let preloadTargets = []
    if (this._backgroundData[target.id].transition) {
      preloadTargets = preloadTargets.concat(this._backgroundData[target.id].transition);
    }
    if (this._backgroundData[target.id].preload) {
      preloadTargets = preloadTargets.concat(this._backgroundData[target.id].preload);
    }
    preloadTargets.forEach((preloadTarget) => {
      if (!this._backgrounds[preloadTarget]._preloaded) {
        this._backgrounds[preloadTarget].load();
        this._backgrounds[preloadTarget]._preloaded = true;
      }
    });
  }
});
