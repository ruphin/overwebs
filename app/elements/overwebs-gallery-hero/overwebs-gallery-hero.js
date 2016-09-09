Polymer({
  is: 'overwebs-gallery-hero',
  properties: {
    hero: {
      type: Object,
      observer: '_heroChanged'
    },
    name: {
      type: String,
      computed: '_name(hero)'
    },
    playerUnlocks: {
      type: Object,
      value: {}
    },
    unlocked: {
      type: Number,
      computed: '_unlocked(playerUnlocks, hero)',
      value: 0
    },
    unlockable: {
      type: Number,
      computed: '_unlockable(hero)'
    }
  },

  observers: [
    '_heroChanged(hero, unlocked)'
  ],

  _heroChanged: function(hero, unlocked) {
    this.$.avatar.classList.add(hero.id)
    this.$.name.style.fontSize = ((hero.scaling || 1) * 2.0833) + 'vw'
    this.$.completion.style.background = hero.color || 'white';
    this.$.completion.style.width = (unlocked / (hero.unlockable || 1) * 6.5625) + "vw";
  },

  _color: function(hero) {
    return hero.color || 'white';
  },

  _name: function(hero) {
    return hero.name || 'Unknown';
  },

  _unlocked: function(playerUnlocks, hero) {
    return playerUnlocks[hero.id] || 0
  },

  _unlockable: function(hero) {
    return hero.unlockable || 1;
  },

});