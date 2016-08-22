Polymer({
  is: 'overwebs-player-data',
  properties: {
    player: {
      type: Object,
      notify: true,
      readOnly: true,
      value: {
        name: 'Urugard',
        level: 56,
        prestige: 1,
        avatar: '0x0250000000000B44',
        unlocks: {
          ana: 7,
          bastion: 23,
          dva: 20,
          genji: 23,
          hanzo: 19,
          junkrat: 23,
          lucio: 22,
          mccree: 24,
          mei: 17,
          mercy: 21,
          pharah: 21,
          reaper: 24,
          reinhardt: 24,
          roadhog: 21,
          soldier76: 26,
          symmetra: 21,
          torbjorn: 20,
          tracer: 20,
          widowmaker: 28,
          winston: 22,
          zarya: 25,
          zenyatta: 45,
          sombra: 0,
        }
      }
    }
  }
});