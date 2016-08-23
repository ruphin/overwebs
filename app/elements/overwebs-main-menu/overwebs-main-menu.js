Polymer({
  is: 'overwebs-main-menu',
  properties: {
    visible: {
      type: Boolean
    },
    heroData: {
      type: Object
    },
    heroes: {
      type: Array,
      computed: '_heroes(heroData)'
    },
    playerData: {
      type: Object
    },
    unlocks: {
      type: Object,
      computed: '_unlocks(playerData)'
    }
  },

  _heroes: function(heroData) {
    return Object.keys(heroData).map(key => heroData[key])
  },

  _unlocks: function(playerData) {
    return playerData.unlocks
  }
});