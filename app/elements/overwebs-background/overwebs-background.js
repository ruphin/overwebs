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

      video.poster = this.resolveUrl(["./images", this.map, this.hero, this._backgroundData[section].fallback + ".jpg"].join("/"));

      // If we're on low bandwidth, don't add a video source
      if (!this.lowBandwidth) {
        video.src = this.resolveUrl(["./videos", this.map, this.hero, section + ".mp4"].join("/"));
      }
      video.playsInline = true;
      video.preload = "none"
      video.id = section
      video.classList.add("hidden");
      Polymer.dom(this.root).appendChild(video);
      this._backgrounds[section] = video
    });
    //console.log(this._backgrounds)
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
    //console.log("-", oldPage, "-", newPage, "-")
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
          newPage = "play_out";
          break;
      }
    }

    if (newPage === "play") {
      newPage = "play_in"
    }
    if (newPage === "training") {
      newPage = "play_in"
    }
    if (newPage === "hero-gallery") {
      newPage = "gallery_in"
    }

    //console.log("-", oldPage, "-", newPage, "-")
    // Unsure if this is necessary. The goal is to prevent flashes of no-background, but it doesn't work.
    // Even when video is pre-loaded or loaded from cache, it still takes 17ms or so to actually pull it from cache and play.
    // It's possible that we need to use posters to fix this.
    window.requestAnimationFrame(() => { this._transition(this._backgrounds[newPage]); });
    this._previous = newPage
  },

  _transition: function (target) {
    // Hide the old background if we were showing one
    // Stop any pending transitions
    // And stop playing video
    if (this._currentlyShowing) {
      this._currentlyShowing.classList.add("hidden");
      this._currentlyShowing.removeEventListener("ended", this._endedListener);
      // Stop preloading triggers
      //console.log("REMOVING")
      this._currentlyShowing.removeEventListener("progress", this._loadListener);
      this._currentlyShowing.pause();
      this._currentlyShowing.loop = false;
      this._currentlyShowing.currentTime = 0;
    }

    // Show the new background
    target.classList.remove("hidden");

    this._currentlyShowing = target

    // Set up a chain of videos that will be preloaded once the target video is loaded
    let preloadTargets = []
    if (this._backgroundData[target.id].transition) {
      preloadTargets = preloadTargets.concat(this._backgroundData[target.id].transition);
    }
    if (this._backgroundData[target.id].preload) {
      preloadTargets = preloadTargets.concat(this._backgroundData[target.id].preload);
    }
    preloadTargets = preloadTargets.map((preloadTarget) => { return this._backgrounds[preloadTarget]; });

    // Start loading
    let preload = (preloadTarget, i) => {
      if (preloadTarget) {
        if (preloadTarget.preload == "auto") {
          preload(preloadTargets[i+1], i+1);
          return;
        }
        //console.log("LOADING: ", preloadTarget.id)
        preloadTarget.preload = "auto";
        preloadTarget.load();
        //console.log("OVERRIDING")
        this._loadListener = () => { waitForBuffer(preloadTarget, () => { preload(preloadTargets[i+1], i+1); } ); };
        //console.log("ADDING")
        preloadTarget.addEventListener("progress", this._loadListener );
      }
    }

    // FIXME: There's an issue where some progress event listeners are not removed.

    // This will wait for the given video element to be buffered for at least 5 seconds
    // And then fire the callback
    let waitForBuffer = (element, callback) => {
      if (element._buffered == true) {
        //console.log("ALREADY BUFFERED: ", element.id)
        //console.log("REMOVING")
        element.removeEventListener("progress", this._loadListener);
        callback();
        return;
      }
      if (element.buffered.length >= 1) {
      //console.log("BUFFERING: ", element.id, element.buffered.end(0))
        if(element.buffered.end(0) === element.duration || element.buffered.end(0) >= 5) {
          //console.log("BUFFERED: ", element.id, element.buffered.end(0), element.duration)
          //console.log("REMOVING")
          element.removeEventListener("progress", this._loadListener);
          element._buffered = true;
          callback();
        }
      }
    }

    // Start preloading the next videos once the target video is buffered
    //console.log("OVERRIDING2")
    this._loadListener = () => { waitForBuffer(target, () => { preload(preloadTargets[0], 0); } ); };
    //console.log("ADDING2")
    target.addEventListener("progress", this._loadListener);

    // Start playing the target video
    if (target.preload !== "auto") {
      target.preload = "auto"
      target.load()
    }
    target.play();

    // Either set up a transition to the next section, or enable looping on the current video
    if (this._backgroundData[target.id].transition) {
      this._endedListener = () => { this._transition(this._backgrounds[this._backgroundData[target.id].transition]); };
      target.addEventListener("ended", this._endedListener);
    } else {
      this._endedListener = () => { target.play(); target.addEventListener("ended", this._endedListener); };
      target.addEventListener("ended", this._endedListener);
    }

  }
});
