{
  let playerData = {
    name: 'Ruphin',
    level: 142,
    avatar: '0x02500000000008E8',
    unlocks: {
      ana: 12,
      bastion: 47,
      dva: 24,
      genji: 42,
      hanzo: 36,
      junkrat: 18,
      lucio: 46,
      mccree: 12,
      mei: 25,
      mercy: 2,
      pharah: 17,
      reaper: 39,
      reinhardt: 10,
      roadhog: 32,
      soldier76: 33,
      symmetra: 15,
      torbjorn: 17,
      tracer: 27,
      widowmaker: 25,
      winston: 46,
      zarya: 18,
      zenyatta: 51,
      sombra: 37,
    }
  };

  let login = {};
  let elements = [];

  class OverwebsPlayerData extends Polymer.Element {

    static get is() { return 'overwebs-player-data' }

    static get properties() {
      return {
        player: {
          type: Object,
          readOnly: true,
          notify: true,
          value: playerData,
        },
        login: {
          type: Object,
          value: login,
          observer: '_loginChanged'
        }
      }
    }

    _notify() {
      this._setPlayer({});
      this._setPlayer(playerData);
    }

    _loginChanged(newLogin) {
      if (newLogin && newLogin.userID) {
        playerData.userID = newLogin.userID
        playerData.name = newLogin.userID.split('-')[0];
        playerData.uid = newLogin.uid;
        elements.forEach((e) => { e._notify() })
      }
    }

    connectedCallback() {
      super.connectedCallback();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      elements.splice(elements.indexOf(this), 1);
    }
      // this.$.haxxUp.onclick = () => {
      //   playerData.level += 1;
      //   elements.forEach((e) => { e._notify() });
      // }
      // this.$.haxxDown.onclick = () => {
      //   playerData.level -= 1;
      //   playerData.level = Math.max(playerData.level, 1);
      //   elements.forEach((e) => { e._notify() });
      // }
      // this.$.haxxUpHard.onclick = () => {
      //   playerData.level += 100;
      //   elements.forEach((e) => { e._notify() });
      // }
      // this.$.haxxDownHard.onclick = () => {
      //   playerData.level -= 100;
      //   playerData.level = Math.max(playerData.level, 1);
      //   elements.forEach((e) => { e._notify() });
      // }
      // this.$.haxxOn.onclick = _ => {
      //   this.debounce('haxxOn', _ => {
      //     for (hero in playerData.unlocks) {
      //       playerData.unlocks[hero] = 999;
      //     }
      //     elements.forEach((e) => { e._notify() });
      //   });
      // }
      // this.$.haxxOff.onclick = _ => {
      //   this.debounce('haxxOff', _ => {
      //     for (hero in playerData.unlocks) {
      //       playerData.unlocks[hero] = 0;
      //     }
      //     elements.forEach((e) => { e._notify() });
      //   });
      // }
  }
  customElements.define(OverwebsPlayerData.is, OverwebsPlayerData);
}
