Polymer({
  is: 'overwebs-global-button',

  ready: function () {
    this.onclick = () => { history.back() };
  }
});