Polymer({
  is: 'overwebs-competitive-page',
  properties: {
    visible: {
      type: Boolean
    },
  },
  ready: function() {
    this.$.return.onclick = this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
  },
  _svgPath: function(fileName) {
    return this.resolveUrl(`images/${fileName}.svg#main`);
  }
});
