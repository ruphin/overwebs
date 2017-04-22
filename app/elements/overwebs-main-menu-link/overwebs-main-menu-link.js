class OverwebsMainMenuLink extends Polymer.Element {

  static get is() { return 'overwebs-main-menu-link' }
  static get properties() {
    return {
      text: {
        type: String
      },
      href: {
        type: String
      }
    }
  }
}

customElements.define(OverwebsMainMenuLink.is, OverwebsMainMenuLink)
