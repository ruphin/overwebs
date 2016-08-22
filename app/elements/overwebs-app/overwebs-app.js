// performance logging
window.performance && performance.mark && performance.mark('overwebs-app - before register');

Polymer({

  is: 'overwebs-app',

  properties: {
    page: {
      type: String,
      reflectToAttribute: true,
      observer: '_pageChanged'
    }
  },

  observers: [
    '_routePageChanged(routeData.page)'
  ],

  listeners: {
    'dom-change': '_domChange'
  },

  created: function() {
    window.performance && performance.mark && performance.mark('overwebs-app.created');
    // Custom elements polyfill safe way to indicate an element has been upgraded.
    this.removeAttribute('unresolved');
  },

  _routePageChanged: function(page) {
    this.page = page || 'home';
    // Scroll to the top of the page on every *route* change. Use `Polymer.AppLayout.scroll`
    // with `behavior: 'silent'` to disable header scroll effects during the scroll.
    Polymer.AppLayout.scroll({ top: 0, behavior: 'silent' });
    // Close the drawer - in case the *route* change came from a link in the drawer.
    this.drawerOpened = false;
  },

  _pageChanged: function(page, oldPage) {
    if (page != null) {
      // home route is eagerly loaded
      if (page == 'home') {
        this._pageLoaded(Boolean(oldPage));
      // other routes are lazy loaded
      } else {
        this.importHref(
          this.resolveUrl('overwebs-' + page + '.html'),
          function() {
            this._pageLoaded(Boolean(oldPage));
          }, null, true);
      }
    }
  },

  _pageLoaded: function(shouldResetLayout) {
    this._ensureLazyLoaded();
    if (shouldResetLayout) {
      // The size of the header depends on the page (e.g. on some pages the tabs
      // do not appear), so reset the header's layout only when switching pages.
      this.async(function() {
        this.$.header.resetLayout();
      }, 1);
    }
  },

  _ensureLazyLoaded: function() {
    // load lazy resources after render and set `loadComplete` when done.
    if (!this.loadComplete) {
      Polymer.RenderStatus.afterNextRender(this, function() {
        this.importHref(this.resolveUrl('lazy-resources.html'), function() {
          // Register service worker if supported.
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js');
          }
          this._notifyNetworkStatus();
          this.loadComplete = true;
        });
      });
    }
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