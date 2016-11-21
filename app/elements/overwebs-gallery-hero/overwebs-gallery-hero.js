Polymer({
  is: 'overwebs-gallery-hero',
  properties: {
    hero: {
      type: Object,
      observer: '_heroChanged'
    },
    unlocks: {
      type: Number,
      value: 0
    },
    'new': {
      type: Boolean,
      reflectToAttribute: true,
    }
  },

  observers: [
    '_heroChanged(hero, unlocks)'
  ],

  ready: function() {
    this.$.glow.addEventListener('animationiteration', (e) => e.target.style = `transform: translate(-50%,-50%) rotate(${Math.floor(Math.random() * 360)}deg);`);
  },

  _heroChanged: function(hero, unlocked) {
    this.classList.add(hero.id);
    this.$.name.style.fontSize = ((hero.scaling || 1) * 2.0833) + 'vw';
    this.$.completion.style.background = hero.color || 'white';
    this.$.completion.style.width = (unlocked / (hero.unlockable || 1) * 6.5625) + "vw";
    this.new = hero.background;
  },

  _color: function(hero) {
    return hero.color || 'white';
  },

  _name: function(hero) {
    return hero.name || 'Unknown';
  },

  _unlocked: function(unlocks, hero) {
    return Math.min(unlocks, hero.unlockable);
  },

  _unlockable: function(hero) {
    return hero.unlockable || 1;
  },

  _new: function(hero) {
    return !!hero.background;
  }
});
