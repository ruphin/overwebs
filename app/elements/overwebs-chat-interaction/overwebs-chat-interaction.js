let messages = {
  introduction: {
    author: 'Ruphin',
    message: 'Welcome to Overwebs! Enable fullscreen with F11 for the best experience',
    channel: 'General',
  },
  leaveMessage: {
    author: 'Ruphin',
    message: 'You can leave me a message by posting in this chat',
    channel: 'General',
  },
  postedMessage: {
    author: 'Oxmaster',
    message: 'Hey',
    channel: 'General',
  },
  leaveEmail: {
    author: 'Ruphin',
    message: 'If you leave your email address I\'ll get back to you!',
    channel: 'General',
  }
}

Polymer({
  is: 'overwebs-chat-interaction',

  // ready: function () {
  //   // Leave a message to tell users to F11
  //   window.setTimeout(() => {
  //     this.fire('post-message', messages.introduction);
  //   }, 10000);
  //
  //   // If they didn't post anything, let them know they can post
  //   this._queuedMessage = setTimeout( _ => {
  //     this.fire('post-message', messages.leaveMessage);
  //   }, 20000);
  // },

  messagePosted: function() {
    // After posting for the first time, let them know I'll read it
    if (!this._posted) {
      // No longer need to let people know they can post
      clearTimeout(this._queuedMessage);

      setTimeout( _ => {
        this.fire('post-message', messages.postedMessage);
      }, 4000);
      //
      // setTimeout( _ => {
      //   this.fire('post-message', messages.leaveEmail);
      // }, 10000);
    }

    this._posted = true;
  }
});
