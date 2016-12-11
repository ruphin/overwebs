{
  let gameState = {
    queueState: {}
  }

  let observers = [];

  Polymer({
    is: 'overwebs-game-state',
    properties: {
      gameState: {
        type: Object,
        readOnly: true,
        value: gameState,
      },
      queueState: {
        type: Object,
        readOnly: true,
        notify: true,
        value: gameState.queueState,
      },
    },

    setQueueState: function(queueState) {
      gameState.queueState = queueState;
      observers.forEach((e) => { e._notifyQueueState() });
    },

    _notifyQueueState: function() {
      this._setQueueState({});
      this._setQueueState(gameState.queueState);
    },

    ready: function () {
      observers.push(this);
    }
  });
}
