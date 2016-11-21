{
  let playerData = {
    name: 'DeMusliM',
    level: 142,
    avatar: '0x02500000000008E8',
    unlocks: {
      ana: 0,
      bastion: 0,
      dva: 0,
      genji: 0,
      hanzo: 0,
      junkrat: 0,
      lucio: 0,
      mccree: 0,
      mei: 0,
      mercy: 0,
      pharah: 0,
      reaper: 0,
      reinhardt: 0,
      roadhog: 0,
      soldier76: 0,
      symmetra: 0,
      torbjorn: 0,
      tracer: 0,
      widowmaker: 0,
      winston: 0,
      zarya: 0,
      zenyatta: 0,
      sombra: 0,
    }
  }

  let elements = [];

  Polymer({
    is: 'overwebs-player-data',
    properties: {
      player: {
        type: Object,
        notify: true,
        readOnly: true,
        value: playerData,
      },
    },

    _notify: function() {
      this._setPlayer({});
      this._setPlayer(playerData);
    },

    ready: function () {
      elements.push(this);
      this.$.haxxUp.onclick = () => {
        playerData.level += 1;
        elements.forEach((e) => { e._notify() });
      }
      this.$.haxxDown.onclick = () => {
        playerData.level -= 1;
        playerData.level = Math.max(playerData.level, 1);
        elements.forEach((e) => { e._notify() });
      }
      this.$.haxxUpHard.onclick = () => {
        playerData.level += 100;
        elements.forEach((e) => { e._notify() });
      }
      this.$.haxxDownHard.onclick = () => {
        playerData.level -= 100;
        playerData.level = Math.max(playerData.level, 1);
        elements.forEach((e) => { e._notify() });
      }
      this.$.haxxOn.onclick = _ => {
        this.debounce('haxxOn', _ => {
          for (hero in playerData.unlocks) {
            playerData.unlocks[hero] = 999;
          }
          elements.forEach((e) => { e._notify() });
        });
      }
      this.$.haxxOff.onclick = _ => {
        this.debounce('haxxOff', _ => {
          for (hero in playerData.unlocks) {
            playerData.unlocks[hero] = 0;
          }
          elements.forEach((e) => { e._notify() });
        });
      }
    }
  });
}
