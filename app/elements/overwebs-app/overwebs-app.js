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
    '_routePageChanged(routeData.view)'
  ],

  listeners: {
    'dom-change': '_domChange'
  },

  created: function() {
    window.performance && performance.mark && performance.mark('overwebs-app.created');
    // Custom elements polyfill safe way to indicate an element has been upgraded.
    this.removeAttribute('unresolved');
  },

  _routePageChanged: function(view) {
    this.page = view || 'home';
  },

  _pageChanged: function(newRoute, oldRoute) {
    console.log(newRoute, oldRoute)
    if (newRoute != null) {
      // home route is eagerly loaded
      if (newRoute == 'home') {
        this._pageLoaded(newRoute, oldRoute);
      // other routes are lazy loaded
      } else {
        this.importHref(
          this.resolveUrl('../overwebs-' + newRoute + '/overwebs-' + newRoute + '.html'),
          function() {
            this._pageLoaded(newRoute, oldRoute);
          }, null, true);
      }
    }
  },

  _pageLoaded: function(newRoute, oldRoute) {
    let newPage = Array.prototype.find.call(this.$.pages.children, (function(page) {return page && page.getAttribute("route") === newRoute;}));
    if (newPage) {
      let oldPage = Array.prototype.find.call(this.$.pages.children, (function(page) {return page && page.getAttribute("route") === oldRoute;}));
      console.log(oldPage)
      console.log(newPage)
      if (oldPage) {
        oldPage.classList.remove("visible")
      }
      newPage.classList.add("visible")
      console.log(oldPage)
      console.log(newPage)
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