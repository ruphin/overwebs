{
  let gameState = {
    queueState: {}
  }

  let observers = [];

  Polymer({
    is: 'overwebs-queue-manager',

    ready: function() {
      this.$['game-state']
    },

    stopQueue: function() {
      this.$['game-state'].setQueueState({ queued: false });
      window.clearInterval(this.queueTimer);
    },

    queue: function(queueType) {
      let startTime = moment();
      this.$['game-state'].setQueueState({ queued: true, start: startTime, type: queueType });

      // Set up clock databinding timing element
      this.queueTimer = window.setInterval(() => {
        this.elapsedTime = (moment(moment().diff(startTime))).format("m:ss");
      }, 1000)

      // Push an event to have everything rendered in the notification
      this.dispatchEvent(new CustomEvent('notification', { 'detail': {
        'title': this.$['notification-title'],
        'message': this.$['notification-message'],
        'button': this.$['notification-button'],
      }}));
    }
  });
}
