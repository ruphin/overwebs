Polymer({
  is: 'overwebs-gallery-page',

  ready: function() {
    this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
  },
  
  _heroes: function(heroData) {
    return Object.keys(heroData).map(key => heroData[key])
  },

  _unlocks: function(playerData) {
    return playerData.unlocks
  },

  _backgroundRef: function(hero) {
    if (!hero.background) {
      return "javascript:;";
    } else {
      return `/?background=./${hero.id}`;
    }
  },

});
