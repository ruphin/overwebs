Polymer({
  is: 'overwebs-play-page',
  ready: function() {
    this.$.backButton.onclick = (event) => {
      // this.$.season2.classList.remove('visible');
      event.stopPropagation();
      history.back();
    };
    this.time = 0

    // this.$.overlayButton.onclick = (event) => {
    //   this.$.season2.classList.remove('visible');
    //   event.stopPropagation();
    //   history.back();
    // };
    // this.$.seasonInfoButton.onclick = (event) => {
    //   this.$.season2.classList.add('visible');
    // };
    this.$['quick-play'].onclick = () => {
      this.dispatchEvent(new CustomEvent('queue', { 'detail': {'queue-type': 'Quick Play'} }));
    };
  },
});
