Polymer({
  is: 'overwebs-login-page',
  properties: {
    username: {
      type: String,
      observer: '_usernameChanged'
    },
  },
  _login: function (e) {
    e.preventDefault();
    console.log(`Logging in as ${username}`)
    console.log(this.playerData)
    // Use the username and change playerData
    // Go to main page
  },
  _usernameChanged: function(username) {
    if (username) {
      this.loginValid = "-1";
    } else {
      this.loginValid = false;
    }
  }

});
