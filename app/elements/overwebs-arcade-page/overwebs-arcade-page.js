Polymer({
  is: 'overwebs-arcade-page',
  ready: function() {
    this.$.backButton.onclick = (event) => {
      // this.$.season2.classList.remove('visible');
      event.stopPropagation();
      history.back();
    };
  }
});
