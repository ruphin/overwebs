Polymer({
  is: 'overwebs-play-page',
  properties: {
    visible: {
      type: Boolean
    },
  },
  ready: function() {
    this.$.backButton.onclick = (event) => {
      // this.$.season2.classList.remove('visible');
      event.stopPropagation();
      history.back();
    };
    // this.$.overlayButton.onclick = (event) => {
    //   this.$.season2.classList.remove('visible');
    //   event.stopPropagation();
    //   history.back();
    // };
    // this.$.seasonInfoButton.onclick = (event) => {
    //   this.$.season2.classList.add('visible');
    // };
  }
});
