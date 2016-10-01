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
    level: {
      type: Number,
      computed: '_level(player)'
    },
  },

  _playerChanged: function(player) {
    if (player.avatar) {
      this.$.avatar.style.backgroundImage = 'url(https://blzgdapipro-a.akamaihd.net/game/unlocks/' + player.avatar + '.png)';
    }
    if (player.prestige) {
      this.$.prestige.style.backgroundImage = 'url(/images/prestige/' + player.prestige + '.png)';
    }
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
    return player.level || '';
  },

});
