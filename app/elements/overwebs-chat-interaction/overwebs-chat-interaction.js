let messages = {
  one: {
    author: 'Oxmaster',
    message: 'dicks out for sombra',
    channel: 'General',
  },
  two: {
    author: 'Trollmaster',
    message: 'this patch so lame, 3v3 is unbalanced af',
    channel: 'General',
  },
  three: {
    author: 'Ruphin',
    message: 'Zenyatta gets nerfed so hard by sombra ult :<',
    channel: 'General',
  },
  postedMessage: {
    author: 'Ruphin',
    message: 'Oh hey',
    channel: 'General',
  },
  leaveEmail: {
    author: 'Ruphin',
    message: "Aren't you a pro player?",
    channel: 'General',
  }
}

Polymer({
  is: 'overwebs-chat-interaction',

  ready: function () {
    window.setTimeout(() => {
      this.fire('post-message', messages.one);
    }, 1000);
    this._queuedMessage = setTimeout( _ => {
      this.fire('post-message', messages.two);
    }, 1500);
    this._queuedMessage = setTimeout( _ => {
      this.fire('post-message', messages.three);
    }, 26000);
  },

  messagePosted: function() {
    // After posting for the first time, let them know I'll read it
    if (!this._posted) {
      // No longer need to let people know they can post
      clearTimeout(this._queuedMessage);

      setTimeout( _ => {
        this.fire('post-message', messages.postedMessage);
      }, 4000);

      setTimeout( _ => {
        this.fire('post-message', messages.leaveEmail);
      }, 10000);
    }

    this._posted = true;
  }
});
