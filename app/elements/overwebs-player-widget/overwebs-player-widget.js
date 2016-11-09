let prestige = ['bronze', 'silver', 'gold']

Polymer({
  is: 'overwebs-player-widget',
  properties: {
    player: {
      type: Object,
      observer: '_playerChanged',
      value: {}
    },
    name: {
      type: String,
      computed: '_name(player)'
    },
  },

  _playerChanged: function(player) {
    if (player === undefined) {
      return;
    }
    if (player.avatar) {
      this.$.avatar.style.backgroundImage = 'url(https://blzgdapipro-a.akamaihd.net/game/unlocks/' + player.avatar + '.png)';
    }
    this.$.levelBox.classList.remove(prestige);
    this.$.levelBox.classList.add(prestige[Math.trunc(player.level / 600)]);
    this.$.status.style.background = this._statusBackground(player);
  },

  _statusBackground: function(player) {
    switch(player.status) {
      case 'available': return '#7DFF00';
      case 'away': return 'yellow';
      case 'busy': return 'red';
      default: return '#7DFF00';
    }
  },

  _name: function(player) {
    return player.name || '';
  },

  _level: function(player) {
    return player.level % 100;
  },

  _stars: function(player) {
    return Array.from('★'.repeat(Math.trunc((player.level % 600) / 100)));
  }

});
