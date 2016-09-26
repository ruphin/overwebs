Polymer({
  is: 'overwebs-gallery-page',
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
  },

  ready: function() {
    this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
  }
});
