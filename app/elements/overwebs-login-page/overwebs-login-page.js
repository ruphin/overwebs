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

  connectedCallback() {
    super.connectedCallback();
    this.$.loginbutton.addEventListener('click', e => this._login(e));
    this.$.anonymousbutton.addEventListener('click', e => this._login(e));
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
    this._debouncer = Polymer.Debouncer.debounce(
      this._debouncer,
      Polymer.Async.animationFrame,
      _ => {
        if (username) {
          this.loginValid = "-1";
        } else {
          this.loginValid = false;
        }
      }
    );
  }
}

customElements.define(OverwebsLoginPage.is, OverwebsLoginPage)
