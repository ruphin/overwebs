Polymer({
  is: 'overwebs-login-page',
  properties: {
    login: {
      type: String,
      observer: '_loginChanged'
    },
  },

  ready: function () {
    this.loginValid = false;
  },

  _login: function (e) {
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


  },

  _loginChanged: function(username) {
    this.debounce('loginChanged', _ => {
      if (username) {
        this.loginValid = "-1";
      } else {
        this.loginValid = false;
      }
    }, 100);

  }

});
