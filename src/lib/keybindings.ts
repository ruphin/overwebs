/**
 * Global keyboard shortcuts. An element binds a key to itself with `bindKey()`;
 * when the key is pressed and the element is visible, the element is clicked.
 */

export interface Keybinding {
  /** The `KeyboardEvent.key` value. */
  readonly key: string;
  readonly label: string;
}

/** The configurable actions and their default keys. */
export const keybindings: Readonly<Record<string, Keybinding>> = {
  back: { key: "Escape", label: "Back" },
  apply: { key: "Enter", label: "Apply" },
  restore: { key: "Backspace", label: "Restore Defaults" },
};

interface Binding {
  readonly target: HTMLElement;
  readonly override: boolean;
}

const bindings = new Map<string, Binding[]>();

const isVisible = (element: HTMLElement): boolean =>
  typeof element.checkVisibility === "function"
    ? element.checkVisibility()
    : element.offsetParent !== null;

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.defaultPrevented) {
    return;
  }
  const targets = bindings.get(event.key);
  if (!targets) {
    return;
  }
  for (const { target, override } of [...targets]) {
    if (isVisible(target)) {
      event.stopPropagation();
      target.click();
    }
    if (override) {
      break;
    }
  }
};

let installed = false;

/** Starts listening for key presses on the window. Called by `bindKey()`. */
export const installKeybindings = (): void => {
  if (!installed) {
    installed = true;
    window.addEventListener("keydown", handleKeydown, true);
  }
};

/**
 * Clicks `target` when `key` is pressed and the target is visible.
 *
 * Bindings are triggered in registration order. A binding with `override`
 * is placed first and stops the other bindings of the key from triggering.
 * The binding is removed when the returned function is called or `signal` aborts.
 */
export const bindKey = (
  key: string,
  target: HTMLElement,
  options: { override?: boolean; signal?: AbortSignal } = {},
): (() => void) => {
  installKeybindings();
  const binding: Binding = { target, override: options.override ?? false };
  const list = bindings.get(key) ?? [];
  if (binding.override) {
    list.unshift(binding);
  } else {
    list.push(binding);
  }
  bindings.set(key, list);
  const unbind = () => {
    const current = bindings.get(key);
    if (!current) {
      return;
    }
    const index = current.indexOf(binding);
    if (index !== -1) {
      current.splice(index, 1);
    }
    if (current.length === 0) {
      bindings.delete(key);
    }
  };
  if (options.signal?.aborted) {
    unbind();
  } else {
    options.signal?.addEventListener("abort", unbind, { once: true });
  }
  return unbind;
};
