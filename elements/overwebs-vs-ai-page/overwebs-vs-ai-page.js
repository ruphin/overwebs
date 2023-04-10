Polymer({
  is: 'overwebs-vs-ai-page',
  ready: function() {
    this.$.backButton.onclick = (event) => {
      event.stopPropagation();
      history.back();
    }
  }
});
