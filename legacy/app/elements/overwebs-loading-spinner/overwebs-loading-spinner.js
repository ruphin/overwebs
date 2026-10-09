Polymer({
  is: 'overwebs-loading-spinner',
  properties: {
    size: {
      type: Number,
      value: 52,
      observer: '_sizeChanged'
    },
  },

  _sizeChanged: function() {
    this.$.svg.style.width = `calc(${this.size} / 25.6 * 1vw)`;
    this.$.svg.style.height = `calc(${this.size} / 25.6 * 1vw)`;
  }
});
