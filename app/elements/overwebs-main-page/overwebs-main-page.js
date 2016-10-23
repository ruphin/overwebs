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
    backgroundSelection: {
      type: Object
    },
    hero: {
      type: String,
      computed: '_hero(backgroundSelection)'
    },
  },

  _hero: function (background) {
    let hero = background.pop();
    this.unlocked = this.playerData.unlocks[hero];
    this.unlockable = this.heroData[hero].unlockable;
    return this.heroData[hero].name;
  }
});
