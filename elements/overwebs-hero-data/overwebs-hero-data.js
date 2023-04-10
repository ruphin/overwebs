{
  let heroData = {
    ana: {
      id: 'ana',
      name: 'Ana',
      unlockable: 73,
      color: '#708AB3',
      background: false,
    },
    bastion: {
      id: 'bastion',
      name: 'Bastion',
      unlockable: 73,
      color: '#7C907B',
      background: true,
    },
    dva: {
      id: 'dva',
      name: 'D.Va',
      unlockable: 73,
      color: '#F095CA',
      background: true,
    },
    genji: {
      id: 'genji',
      name: 'Genji',
      unlockable: 70,
      color: '#97F044',
      background: true,
    },
    hanzo: {
      id: 'hanzo',
      name: 'Hanzo',
      unlockable: 69,
      color: '#BAB48A',
      background: false,
    },
    junkrat: {
      id: 'junkrat',
      name: 'Junkrat',
      unlockable: 73,
      color: '#E9BD51',
      background: false,
    },
    lucio: {
      id: 'lucio',
      name: 'Lúcio',
      unlockable: 73,
      color: '#85CA53',
      background: false,
    },
    mccree: {
      id: 'mccree',
      name: 'McCree',
      unlockable: 71,
      color: '#B05A5D',
      background: true,
    },
    mei: {
      id: 'mei',
      name: 'Mei',
      unlockable: 76,
      color: '#6DABEC',
      background: false,
    },
    mercy: {
      id: 'mercy',
      name: 'Mercy',
      unlockable: 73,
      color: '#ECEABD',
      background: false,
    },
    orisa: {
      id: 'orisa',
      name: 'Orisa',
      unlockable: 55,
      color: '#448A42',
      background: false,
    },
    pharah: {
      id: 'pharah',
      name: 'Pharah',
      unlockable: 73,
      color: '#3C7BC6',
      background: true,
    },
    reaper: {
      id: 'reaper',
      name: 'Reaper',
      unlockable: 73,
      color: '#7E3F52',
      background: true,
    },
    reinhardt: {
      id: 'reinhardt',
      name: 'Reinhardt',
      unlockable: 74,
      color: '#94A0A6',
      background: false,
    },
    roadhog: {
      id: 'roadhog',
      name: 'Roadhog',
      unlockable: 74,
      color: '#B58C51',
      background: true,
    },
    soldier76: {
      id: 'soldier76',
      name: 'Soldier: 76',
      unlockable: 72,
      color: '#6A7894',
      background: true,
    },
    sombra: {
      id: 'sombra',
      name: 'Sombra',
      unlockable: 67,
      color: '#765CB9',
      background: true,
    },
    symmetra: {
      id: 'symmetra',
      name: 'Symmetra',
      unlockable: 72,
      color: '#90BDD0',
      background: false,
    },
    torbjorn: {
      id: 'torbjorn',
      name: 'Torbjörn',
      unlockable: 72,
      color: '#C27670',
      background: false,
    },
    tracer: {
      id: 'tracer',
      name: 'Tracer',
      unlockable: 74,
      color: '#D89342',
      background: true,
    },
    widowmaker: {
      id: 'widowmaker',
      name: 'Widowmaker',
      unlockable: 72,
      color: '#9E6AA7',
      background: true,
    },
    winston: {
      id: 'winston',
      name: 'Winston',
      unlockable: 72,
      color: '#A1A6BD',
      background: true,
    },
    zarya: {
      id: 'zarya',
      name: 'Zarya',
      unlockable: 72,
      color: '#EA80B7',
      background: false,
    },
    zenyatta: {
      id: 'zenyatta',
      name: 'Zenyatta',
      unlockable: 72,
      color: '#EEE783',
      background: false,
    },
  }

  let elements = [];

  Polymer({
    is: 'overwebs-hero-data',
    properties: {
      heroes: {
        type: Object,
        notify: true,
        readOnly: true,
        value: heroData
      }
    },

    _notify: function() {
      this._setHeroes({});
      this._setHeroes(heroData);
    },

    ready: function () {
      elements.push(this);
      // this.$.haxxOn.onclick = () => {
      //   this.debounce('haxxOn', _ => {
      //     for (hero in heroData) {
      //       heroData[hero].background = true;
      //     }
      //     elements.forEach((e) => { e._notify() });
      //   });
      // }
      // this.$.haxxOff.onclick = () => {
      //   this.debounce('haxxOff', _ => {
      //     for (hero in heroData) {
      //       heroData[hero].background = false;
      //     }
      //     elements.forEach((e) => { e._notify() });
      //   });
      // }
    }
  });
}
