// performance logging
window.performance && performance.mark && performance.mark('overwebs-app - before register');

Polymer({

  is: 'overwebs-app',

  properties: {
    route: {
      type: Object,
      reflectToAttribute: true,
      observer: '_routeChanged'
    },

    routes: {
      type: Object,
      value: {}
    }
  },

  listeners: {
    'dom-change': '_domChange'
  },

  created: function() {
    window.performance && performance.mark && performance.mark('overwebs-app.created');
    // Custom elements polyfill safe way to indicate an element has been upgraded.
    this.removeAttribute('unresolved');
  },

  ready: function() {
    Array.prototype.map.call(this.$.pages.children, (page) => {
      this.routes[page.getAttribute("route")] = page;
    });

    this.$.background.ontimeupdate = () => {
      if (this.$.background.currentTime >= 50){
        var blah = this.$.background.currentTime; 
        this.$.background.currentTime = 6;
        console.log(blah);
      }
    }
  },

// NOTE: This is broken in non-chrome browsers
// For some reason _routeChanged for the initial visit is called before 'ready' has
// populated the route map.
  _routeChanged: function(newRoute, oldRoute) {
    // Remove initial '/' in the route path
    oldRoute = oldRoute && oldRoute.path.slice(1)
    newRoute = newRoute && newRoute.path.slice(1)

    if (newRoute === "exit-game") {
      this._showExitBanner();
      return;
    }

    if (oldRoute === "exit-game") {
      this._hideExitBanner();
      return;
    }

    // Hide the old page
    if (this.routes[oldRoute]) {
      this.routes[oldRoute].classList.remove("visible")
    }

    // Show the new page
    if (this.routes[newRoute]) {
      this.routes[newRoute].classList.add("visible")
    } else {
      // Go back if the new page does not exist (and the old page does)
      if (this.routes[oldRoute]) {
        console.warn("Requested page does not exist");
        window.history.back();
        return;
      }
    }

    // Lazy load any new pages we are visiting that haven't been loaded yet
    if (newRoute != '') {
      newPage = this.resolveUrl('../overwebs-' + newRoute + '/overwebs-' + newRoute + '.html')
      this.importHref(newPage, null, function() {
        console.warn("Cannot load new page");
        window.history.back();
      }, true);
    }
  },

  _showExitBanner: function() {
    this.style.opacity = 0.5
    console.log("Really Quit?")
  },

  _hideExitBanner: function() {
    this.style.opacity = 1
    console.log("Phew!!")
  },

  // This is for performance logging only.
  _domChange: function(e) {
    if (window.performance && performance.mark && !this.__loggedDomChange) {
      var target = Polymer.dom(e).rootTarget;
      if (target.domHost.is.match(this.page)) {
        this.__loggedDomChange = true;
        performance.mark(target.domHost.is + '.domChange');
      }
    }
  }
});