let nonPrintable = /^[\x00-\x20]*$/;

Polymer({
  is: 'overwebs-chat-widget',
  properties: {
    player: {
      type: Object,
      value: {name: 'SomeGuy'},
    },
    _history: {
      type: Array,
      value: [],
    },
  },


  ready: function () {
    this._channel = 'General';
    this.$.chatBox.addEventListener('dom-change', () => { this._scrollToBottom() });
    this.addEventListener('focusout', () => {this._loseFocus() });
    this.addEventListener('focusin', () => {this._gainFocus() });
    this.onclick = (event) => {
      if (event.target === this.$.escape) {
        if (this.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      } else {
        if (this.$.input !== document.activeElement) {
          this.$.input.focus();
        } else {
          this._onSubmit();
        }
      }
      event.stopPropagation();
      event.preventDefault();
    }
    this.addEventListener('post-message', (e) => {
      let m = e.detail;
      this.postMessage(m.author, m.channel, m.message);
    });

    // Check if this user has previously used the app on this device.
    // If so, re-login with his old ID
    // Otherwise,
    let cookieID = document.cookie.replace(/(?:(?:^|.*;\s*)firebaseID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookieID) {
      // This user already has a login. Signin with this existing login
      this.firebase.auth().signInWithEmailAndPassword(`${cookieID}@ruph.in`, cookieID)
      .then((e) => { this.firebaseUser = e.uid; }) // Store his uid if login succesful
      .catch((e) => { console.log(e); }); // Log error
    } else {
      // This user has no existing login. Generate a random one, and log him in with that
      let randomID = Math.random().toString(36).slice(2,-10) // Generate some random alphanumerics for his ID
      document.cookie = `firebaseID=${randomID}` // Store his ID in a cookie
      this.firebase.auth().createUserWithEmailAndPassword(`${randomID}@ruph.in`, randomID)
      .then((e) => { this.firebaseUser = e.uid; }) // Store his uid if login succesful
      .catch((e) => { console.log(e); }); // Log error
    }
  },

  postMessage: function(author, channel, message) {
    let chatBox = this.$.chatBox;
    this._shouldScroll = (chatBox.scrollTop === chatBox.scrollHeight - chatBox.offsetHeight);
    this.unshift('_history',
      {
        author: author,
        message: message,
        channel: channel,
        timestamp: Date.now(),
      });
  },

  _gainFocus: function() {
    if (this.contains(document.activeElement) || this === document.activeElement) {
    this.$.escape.key = "Escape";
      this.classList.add("focus");
      this._scrollToBottom();
    }
  },

  _loseFocus: function() {
    if (!this.contains(document.activeElement) || this !== document.activeElement) {
      this.$.escape.key = "";
      this.classList.remove("focus");
      this._scrollToBottom();
    }
  },

  _onSubmit: function() {
    let message = this.$.input.value;
    if (nonPrintable.test(message)) {
      document.activeElement.blur();
      return;
    }
    //this.postMessage(this.player.name, this._channel, message);
    this.postMessage('You', this._channel, message);
    this.$.input.value = "";
    // Let the chatInteraction element know a message has been posted
    this.$.chatInteraction.messagePosted()
    // Push any messages posted to firebase
    this.firebase.database().ref(`messages/${this.firebaseUser}`).push(message);

  },

  _scrollToBottom: function() {
    let lastMessage = this.$.chatBox.querySelector(".message:first-of-type");
    if (lastMessage && this._shouldScroll) {
      lastMessage.scrollIntoView();
    }
  },

  // TODO
  _hideMessages: function() {
    // Check if messages need to be hidden
    // This will be so annoying ..
  }
});
