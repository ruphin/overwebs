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
      observer: '_register'
    },
    out: {
      type: String
    }
  },

  _register: function (newKey, oldKey) {
    if (oldKey && registeredElements[oldKey]) {
      let i = registeredElements[oldKey].indexOf(this)
      if (i != -1) {
        registeredElements[oldKey].splice(i, 1);
      }
    }
    if (newKey) {
      if (!registeredElements[newKey]) {
        registeredElements[newKey] = []
      }
      registeredElements[newKey].push(this);
    }
  }
});
