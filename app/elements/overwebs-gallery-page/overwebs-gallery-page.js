Polymer({
  is: 'overwebs-gallery-page',
  properties: {
    heroData: {
      type: Object,
      notify: true,
    },
    playerData: {
      type: Object,
      notify: true,
    }
  },

  ready: function() {
    this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
    this.$.haxxOn.onclick = (event) => {
      for (hero in this.heroData) {
        this.playerData.unlocks[hero] = this.heroData[hero].unlockable;
        this.heroData[hero].background = true;
      }

      let tmpHeroData = this.heroData;
      this.set('heroData', {});
      setTimeout(_ => {
        this.set('heroData', tmpHeroData);
      }, 0)
    }
    this.$.haxxOff.onclick = (event) => {
      for (hero in this.heroData) {
        this.playerData.unlocks[hero] = 0;
        this.heroData[hero].background = false;
      }

      let tmpHeroData = this.heroData;
      this.set('heroData', {});
      setTimeout(_ => {
        this.set('heroData', tmpHeroData)
      }, 0)
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
