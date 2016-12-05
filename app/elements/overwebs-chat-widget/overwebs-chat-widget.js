let nonPrintable = /^[\x00-\x20]*$/;

Polymer({
  is: 'overwebs-chat-widget',
  properties: {
    playerData: {
      type: Object,
    },
    firebase: {
      type: Object,
    },
    _history: {
      type: Array,
      value: [],
    },
  },
  observers: [
    '_firebaseConnected(firebase, playerData)'
  ],


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
    this.postMessage(this.playerData.name, this._channel, message);
    this.$.input.value = "";
    // Let the chatInteraction element know a message has been posted
    this.$.chatInteraction.messagePosted();
    // Push any messages posted to firebase
    if (this.chatData) {
      this.chatData.push(message);
    }
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
  },

  _firebaseConnected: function(firebase, playerData) {
    if (firebase && playerData && playerData.uid) {
      this.chatData = firebase.database().ref(`messages/${this.playerData.uid}`);
    }
  }
});
