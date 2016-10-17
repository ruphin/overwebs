var nonPrintable = /^[\x00-\x20]*$/;

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
    }
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

    // DEMO PURPOSES
    this.$.spam1.onclick = (event) => {
      setTimeout(() => {
        this.postMessage("Oxmaster", "general", "What up what up");
      }, 5000);
      setTimeout(() => {
        this.postMessage("Tracer365", "general", "Boring....");
      }, 9000);
      setTimeout(() => {
        this.postMessage("Oxmaster", "general", "Nobody here?");
      }, 60000);
      event.stopPropagation();
      event.preventDefault();
    }

    this.$.spam2.onclick = (event) => {
      setTimeout(() => {
        this.postMessage("Oxmaster", "general", "What's good fam");
      }, 3000);
      setTimeout(() => {
        this.postMessage("d-snp", "general", "What's going on in this thread?");
      }, 7000);
      setTimeout(() => {
        this.postMessage("John", "general", "Anyone for competetive queue?");
      }, 60000);
      event.stopPropagation();
      event.preventDefault();
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
    this.postMessage(this.player.name, this._channel, message);
    this.$.input.value = "";

  },

  _scrollToBottom: function() {
    let lastMessage = this.$.chatBox.querySelector(".message:first-of-type");
    if (lastMessage && this._shouldScroll) {
      console.log("scrolling")
      lastMessage.scrollIntoView();
    }
  },

  // TODO
  _hideMessages: function() {
    // Check if messages need to be hidden
    // This will be so annoying ..
  }
});
