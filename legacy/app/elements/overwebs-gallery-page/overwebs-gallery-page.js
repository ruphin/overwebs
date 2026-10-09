Polymer({
  is: 'overwebs-gallery-page',

  ready: function() {
    this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
  },

  _heroes: function(heroData) {
    this.$.heroes.render();
    return Object.keys(heroData).map(key => heroData[key]);
  },

  _unlocks: function(hero, playerData) {
    return playerData.unlocks && playerData.unlocks[hero.id] || 0;
  },

  _backgroundRef: function(hero) {
    if (!hero.background) {
      return "javascript:;";
    } else {
      return `/main?background=./${hero.id}`;
    }
  },

});
