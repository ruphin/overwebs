Polymer({
  is: 'overwebs-hero-data',
  properties: {
    heroes: {
      type: Object,
      notify: true,
      readOnly: true,
      value: {
        ana: {
          id: 'ana',
          name: 'Ana',
          unlockable: 59,
          color: '#400A44'
        },
        bastion: {
          id: 'bastion',
          name: 'Bastion',
          unlockable: 60,
          color: '#1D2B14'
        },
        dva: {
          id: 'dva',
          name: 'D.Va',
          unlockable: 60,
          color: '#F93080'
        },
        genji: {
          id: 'genji',
          name: 'Genji',
          unlockable: 60,
          color: '#32F600'
        },
        hanzo: {
          id: 'hanzo',
          name: 'Hanzo',
          unlockable: 59,
          color: '#706025'
        },
        junkrat: {
          id: 'junkrat',
          name: 'Junkrat',
          unlockable: 59,
          color: '#F27000'
        },
        lucio: {
          id: 'lucio',
          name: 'Lúcio',
          unlockable: 63,
          color: '#238B02'
        },
        mccree: {
          id: 'mccree',
          name: 'McCree',
          unlockable: 60,
          color: '#640607'
        },
        mei: {
          id: 'mei',
          name: 'Mei',
          unlockable: 60,
          color: '#1351E4'
        },
        mercy: {
          id: 'mercy',
          name: 'Mercy',
          unlockable: 60,
          color: '#F5E269'
        },
        pharah: {
          id: 'pharah',
          name: 'Pharah',
          unlockable: 61,
          color: '#001984'
        },
        reaper: {
          id: 'reaper',
          name: 'Reaper',
          unlockable: 61,
          color: '#1D0002'
        },
        reinhardt: {
          id: 'reinhardt',
          name: 'Reinhardt',
          unlockable: 61,
          color: '#334142',
          scaling: 0.9
        },
        roadhog: {
          id: 'roadhog',
          name: 'Roadhog',
          unlockable: 59,
          color: '#6C2803'
        },
        soldier76: {
          id: 'soldier76',
          name: 'Soldier: 76',
          unlockable: 61,
          color: '#0F132E',
          scaling: 0.8
        },
        symmetra: {
          id: 'symmetra',
          name: 'Symmetra',
          unlockable: 60,
          color: '#2E7595',
          scaling: 0.9
        },
        torbjorn: {
          id: 'torbjorn',
          name: 'Torbjörn',
          unlockable: 61,
          color: '#79120B',
          scaling: 0.9
        },
        tracer: {
          id: 'tracer',
          name: 'Tracer',
          unlockable: 62,
          color: '#BA3202'
        },
        widowmaker: {
          id: 'widowmaker',
          name: 'Widowmaker',
          unlockable: 62,
          color: '#410B45',
          scaling: 0.7
        },
        winston: {
          id: 'winston',
          name: 'Winston',
          unlockable: 60,
          color: '#46496A'
        },
        zarya: {
          id: 'zarya',
          name: 'Zarya',
          unlockable: 61,
          color: '#EB1C62'
        },
        zenyatta: {
          id: 'zenyatta',
          name: 'Zenyatta',
          unlockable: 60,
          color: '#F8DA1A'
        },
        // sombra: {
        //   id: 'sombra',
        //   name: 'Sombra',
        //   unlockable: 60,
        //   color: '#FFFFFF'
        // },
      }
    }
  }
});