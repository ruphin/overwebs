class OverwebsMainPage extends Polymer.Element {

  static get is() { return 'overwebs-main-page' }

  static get observers() {
    return [
      '_heroChanged(heroData, playerData, backgroundSelection)'
    ]
  }

  _heroChanged(heroData, playerData, backgroundSelection) {
    if (heroData === undefined || playerData === undefined || backgroundSelection === undefined) { return }
    let hero = backgroundSelection.split('/').slice(0,-1).pop();
    this.hero = this.heroData[hero] && this.heroData[hero].name || '';

    if (playerData.unlocks && heroData[hero]) {
     this.unlocked = Math.min(playerData.unlocks[hero], heroData[hero].unlockable);
    } else {
     this.unlocked = 0;
    }

    this.unlockable = heroData[hero] && heroData[hero].unlockable || 0;
  }
}

customElements.define(OverwebsMainPage.is, OverwebsMainPage);
