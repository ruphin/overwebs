Polymer({
  is: 'overwebs-main-page',

  _hero: function (heroData, backgroundSelection) {
    let hero = backgroundSelection.split('/').slice(0,-1).pop();
    return this.heroData[hero] && this.heroData[hero].name || '';
  },

  _unlocked: function (playerData, heroData, backgroundSelection) {
    let hero = backgroundSelection.split('/').slice(0,-1).pop();
    if (playerData.unlocks && heroData[hero]) {
     return Math.min(playerData.unlocks[hero], heroData[hero].unlockable);
    } else {
     return 0;
    }
  },

  _unlockable: function (heroData, backgroundSelection) {
    let hero = backgroundSelection.split('/').slice(0,-1).pop();
    return heroData[hero] && heroData[hero].unlockable || 0;
  }
});
