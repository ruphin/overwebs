let registeredElements = {}

let handleKeydown = (event) => {
  if (event.defaultPrevented) {
    console.warn("Keypress ignored!")
    return; // Should do nothing if the key event was already consumed.
  }

  if (registeredElements[event.key]) {
    // Use `every` so we can break from the loop if there's an override
    registeredElements[event.key].every((element) => {
      if (element.offsetParent !== null) {
        event.stopPropagation();
        element.click();
      }
      // If the element is not an override, return true to keep iterating over elements
      return !element.override;
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
    override: {
      type: Boolean,
      value: false
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
      if (this.override) {
        registeredElements[newKey].unshift(this);
      } else {
        registeredElements[newKey].push(this);
      }
    }
  }
});
