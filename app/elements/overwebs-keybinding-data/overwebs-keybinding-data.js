Polymer({
  is: 'overwebs-keybinding-data',
  properties: {
    bindings: {
      type: Object,
      notify: true,
      value: {
        back: {
          key: 'Escape',
          label: 'Back'
        },
        apply: {
          key: 'Enter',
          label: 'Apply'
        },
        restore: {
          key: 'Backspace',
          label: 'Restore Defaults'
        },
      }
    }
  },
  getLabel: function(action) {
    if (this.bindings[action]) {
      return this.bindings[action].label;
    } else {
      return "";
    }
  },
  getKey: function(action) {
    if (this.bindings[action]) {
      return this.bindings[action].key;
    } else {
      return "";
    }
  }

  //TODO: IndexedDB local storagecache for these, and methods to change the stored bindings
});