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
      observer: "_heroChanged"
    },
  },

  _heroChanged: function (hero) {
    this.unlocked = this.playerData.unlocks[hero];
    this.unlockable = this.heroData[hero].unlockable;
  }
});
