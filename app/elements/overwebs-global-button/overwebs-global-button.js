Polymer({
  is: 'overwebs-global-button',
  properties: {
    action: {
      type: String,
      observer: '_computeLabel'
    },
    key: {
      type: String,
      computed: '_key(action)'
    },
    label: {
      type: String,
      observer: '_setLabel'
    },
    internalLabel: {
      type: String,
    },
  },

  _key: function (action) {
    if (this.action) {
      let key = this.$.keybindingData.getKey(action);
      if (key) {
        return key;
      }
    }
  },

  _setLabel: function(label) {
    this.internalLabel = label;
  },

  _computeLabel: function (action) {
    if (this.label) {
      this.internalLabel = this.label;
    }
    let label = this.$.keybindingData.getLabel(action);
    if (label) {
      this.internalLabel = label;
    }
  }
});
