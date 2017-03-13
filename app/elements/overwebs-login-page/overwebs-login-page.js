class OverwebsLoginPage extends Polymer.Element {

  static get is() { return 'overwebs-login-page' }

  static get properties() {
    return {
      login: {
        type: String,
        observer: '_loginChanged'
      }
    }
  }

  constructor() {
    super()
    this.loginValid = false;
  }

  _login(e) {
    e.preventDefault();
    if (!this.login) {
      this.dispatchEvent(new CustomEvent('login', {
        'detail': { anonymous: true }
      }));
    } else {
      let [username, battleTag] = this.login.split('#');
      this.dispatchEvent(new CustomEvent('login', {
        detail: { username: username, battleTag: battleTag }
      }));
    }
  }

  _loginChanged(username) {
    this.debounce('loginChanged', _ => {
      if (username) {
        this.loginValid = "-1";
      } else {
        this.loginValid = false;
      }
    }, 100);
  }
}

customElements.define(OverwebsLoginPage.is, OverwebsLoginPage)
