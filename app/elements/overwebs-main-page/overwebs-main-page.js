Polymer({
  is: 'overwebs-main-page',
  properties: {
    visible: {
      type: Boolean
    },
    heroData: {
      type: Object
    },
    playerData: {
      type: Object
    },
    hero: {
      type: String,
    },
    test1: {
      type: Object,
    },
    test2: {
      type: Object,
    },
  },

  _heroes: function(heroData) {
    return Object.keys(heroData).map(key => heroData[key])
  },

  ready: function() {
    // Pick a random hero if the hero isn't chosen explicitly
    if (this.hero === undefined) {
      let heroes = Object.keys(this.heroData);
      this.hero = heroes[heroes.length * Math.random() << 0];
    }
  }
});