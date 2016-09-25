let registeredElements = {}

let handleKeydown = (event) => {
  if (event.defaultPrevented) {
    console.warn("Keypress ignored!")
    return; // Should do nothing if the key event was already consumed.
  }

  if (registeredElements[event.key]) {
    registeredElements[event.key].forEach((element) => {
      if (element.offsetParent !== null) {
        event.stopPropagation();
        element.click();
      }
    });
  }
}

window.addEventListener("keydown", handleKeydown, true);

Polymer({
  is: 'overwebs-keybinding',
  properties: {
    key: {
      type: String,
    },
    out: {
      type: String
    }
  },

  ready: function () {
    if (this.key) {
      if (!registeredElements[this.key]) {
        registeredElements[this.key] = []
      }
      registeredElements[this.key].push(this);
    }
  }
});