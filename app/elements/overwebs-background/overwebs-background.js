Polymer({
  is: 'overwebs-background',
  properties: {
    backgrounds: {
      type: Object,
      observer: '_setBackgrounds'
    },
    lowBandwidth: {
      type: Boolean,
      value: false,
    },
    page: {
      type: String,
      observer: "_pageChanged",
    }
  },

  _setBackgrounds: function(backgrounds) {
    // Remove existing backgroundElements
    if (this._backgroundElements) {
      for (let videoElement in this._backgroundElements) {
        // We need to check if the element exists, because one backgroundElement can mirror another, so it may already be removed.
        this._backgroundElements[videoElement] && this._backgroundElements[videoElement].remove();
      }
    }

    this._backgroundElements = {}

    // Create a video element for each background video from the dataset
    for (let section in backgrounds) {
      if (!backgrounds[section].mirror) {
        let video = document.createElement('video');
        video.videoSource = backgrounds[section].video;
        video.posterSource = backgrounds[section].image;
        video.playsInline = true;
        video.preload = "none";
        video.loop = !backgrounds[section].transition
        video.id = section;
        video.classList.add("hidden");
        Polymer.dom(this.root).appendChild(video);
        this._backgroundElements[section] = video;
      }
    }
    // Let the backgrounds that simply mirror an existing background use that element
    for (let section in backgrounds) {
      if (backgrounds[section].mirror) {
        this._backgroundElements[section] = this._backgroundElements[backgrounds[section].mirror];
      }
    }

    this._pageChanged(this.page);
  },

  _pageChanged: function (newPage, oldPage) {
    if (!this.backgrounds) {
      console.warn("Attempting to load page background, but background data is not loaded");
      return;
    }

    // If oldPage is falsy, replace it with emptystring
    oldPage = oldPage || '';

    // The goal is to have it decide automatically what background to use, based on the previous page and new page.
    // It should attempt to find 'previous_to_next', then 'to_next', then 'next', in order.
    let newBackground = this._backgroundElements[oldPage + '_to_' + newPage] ||
                        this._backgroundElements['to_' + newPage] ||
                        this._backgroundElements[newPage];

    if (newBackground) {
      this._transition(newBackground);
    } else {
      console.warn("Page has no background data");
      if (this._currentlyShowing) {
        this._stop(this._currentlyShowing)
      }
    }
  },

  // Stop and hide the given video element.
  // Also remove any pending transitions.
  _stop(element) {
    element.classList.add("hidden");
    element.removeEventListener("ended", this._endedListener);
    if (!element.paused) {
      element.pause();
    }
    element.currentTime = 0;
  },

  // This is all good
  _transition: function (target) {
    // If we are on low bandwith mode, skip transitions
    if (this.lowBandwidth && this.backgrounds[target.id].transition) {
      this._transition(this._backgroundElements[this.backgrounds[target.id].transition]);
      return;
    }

    // Show the new background
    target.poster = target.posterSource;
    target.classList.remove("hidden");

    // Hide whatever we were previously showing
    if (this._currentlyShowing && target !== this._currentlyShowing) {
      this._stop(this._currentlyShowing);
    }

    // If we're not low bandwidth mode, start playing
    if (!this.lowBandwidth) {
      // Start loading the video immediately if it wasn't already loading
      if (target.preload !== "auto") {
        target.src = target.videoSource;
        target.preload = "auto";
        target.load();
      }
      target.play();
    }

    // Update what we're currently showing
    this._currentlyShowing = target

    // Set up a list of elements that should be preloaded
    let preloadTargets = []
    if (this.backgrounds[target.id].transition) {
      preloadTargets = preloadTargets.concat(this.backgrounds[target.id].transition);
    }
    if (this.backgrounds[target.id].preload) {
      preloadTargets = preloadTargets.concat(this.backgrounds[target.id].preload);
    }
    preloadTargets = preloadTargets.map((preloadTarget) => { return this._backgroundElements[preloadTarget]; });

    // On low bandwidth, skip preloading video, and  we only need images
    // for things that don't have transitions.
    preloadTargets.forEach((target) => {
      if (this.lowBandwidth) {
        // Find the last element in the transition chain
        while (this.backgrounds[target.id].transition) {
          target = this._backgroundElements[this.backgrounds[target.id].transition];
        }
      } else {
        if (target.preload !== "auto") {
          target.src = target.videoSource;
          target.preload = "auto";
        }
        // This is required for looping. If a video ends,
        // the 'src' attribute is cleared
        target.src = target.videoSource
      }

      if (target.posterSource) {
        target.poster = target.posterSource;
      }
    });

    // Either set up a transition to the next section, or enable looping on the current video
    if (this.backgrounds[target.id].transition) {
      this._endedListener = () => { this._transition(this._backgroundElements[this.backgrounds[target.id].transition]); };
      target.addEventListener("ended", this._endedListener);
    }
  }
});
