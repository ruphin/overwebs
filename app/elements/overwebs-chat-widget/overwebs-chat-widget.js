let nonPrintable = /^[\x00-\x20]*$/;

class OverwebsChatWidget extends Polymer.Element {

  static get is() { return 'overwebs-chat-widget' }

  static get properties() {
    return {
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
    }
  }
  static get observers() {
    return [
      '_firebaseConnected(firebase, playerData)'
    ]
  }


  connectedCallback() {
    super.connectedCallback();
    this._channel = 'General';
    this.$.chatBox.addEventListener('dom-change', () => { this._scrollToBottom() });
    this.addEventListener('focusout', () => {this._loseFocus() });
    this.addEventListener('focusin', () => {this._gainFocus() });
    this.onclick = (event) => {

      if ((!event.path && event.target || event.path[0]) === this.$.escape) {
        if (this.shadowRoot.contains(this.shadowRoot.activeElement) || this.contains(this.shadowRoot.activeElement)) {
          document.activeElement.blur();
        }
      } else {
        if (this.$.input !== (this.shadowRoot.activeElement)) {
          // Add a microtiming to prevent Firefox from submitting two keydown events
          window.setTimeout(_ => {this.$.input.focus(); }, 0);

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
  }

  postMessage(author, channel, message) {
    let chatBox = this.$.chatBox;
    this._shouldScroll = (chatBox.scrollTop === chatBox.scrollHeight - chatBox.offsetHeight);
    this.unshift('_history',
      {
        author: author,
        message: message,
        channel: channel,
        timestamp: Date.now(),
      });
  }

  _gainFocus() {
    this.$.escape.key = "Escape";
    this.classList.add("focus");
    this._scrollToBottom();
  }

  _loseFocus() {
    this.$.escape.key = "";
    this.classList.remove("focus");
    this._scrollToBottom();
  }

  _onSubmit() {
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
  }

  _scrollToBottom() {
    let lastMessage = this.$.chatBox.querySelector(".message:first-of-type");
    if (lastMessage && this._shouldScroll) {
      lastMessage.scrollIntoView();
    }
  }

  // TODO
  _hideMessages() {
    // Check if messages need to be hidden
    // This will be so annoying ..
  }

  _firebaseConnected(firebase, playerData) {
    if (firebase && playerData && playerData.uid) {
      this.chatData = firebase.database().ref(`messages/${this.playerData.uid}`);
    }
  }
}
customElements.define(OverwebsChatWidget.is, OverwebsChatWidget);
