Polymer({
  is: 'overwebs-arcade-tile',
  properties: {
    popularity: {
      type: Number,
      observer: '_popularityChanged'
    },
    reward: {
      type: Boolean,
      observer: '_rewardChanged'
    },
  },

  _popularityChanged: function(popularity) {
    console.log("POPULARITY: ", popularity)
  },

  _rewardChanged: function(reward) {
    console.log("REWARD: ", reward)
  },
});
