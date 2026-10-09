{
  let prestigeRanks = ['bronze', 'silver', 'gold']

  Polymer({
    is: 'overwebs-player-widget',
    properties: {
      player: {
        type: Object,
        observer: '_playerChanged',
        value: {},
      },
    },

    _playerChanged: function(player) {
      if (player === undefined) {
        return;
      }
      if (player.avatar) {
        this.$.avatar.style.backgroundImage = 'url(' + this.resolveUrl(`avatars/${player.avatar}.png`) + ')';
      }
      this.$.levelBox.classList.remove(prestigeRanks); // TODO: Splat the args
      this.$.levelBox.classList.add(prestigeRanks[Math.trunc(player.level / 600)]);
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
      return player.level && (player.level - 1) % 100 + 1 || 0;
    },

    _stars: function(player) {
      return player.level && Array.from('★'.repeat(Math.trunc(((player.level % 600) - 1) / 100))) || [];
    },

  });
}
