import { GluonElement, css, html } from "@gluon/gluon";
import type { LoginRequest } from "../lib/session.js";

/** A login name: letters, optionally followed by `#` and a numeric battle tag. */
const LOGIN_PATTERN = "^([a-zA-Z]+(#[0-9]+)?)?$";
const loginPattern = new RegExp(LOGIN_PATTERN);

/**
 * The login screen: a username field with "Login" and "Anonymous" buttons.
 * Dispatches `login` with the request; the app shell performs the login.
 */
export class OverwebsLoginPage extends GluonElement {
  static override styles = css`
    :host {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      letter-spacing: calc(1 * var(--u));
    }

    form {
      display: flex;
      flex-flow: column;
      width: calc(400 * var(--u));
      margin-bottom: calc(88 * var(--u));
    }

    label {
      margin-bottom: calc(14 * var(--u));
      font-family: var(--font-ui);
      font-size: calc(24 * var(--u));
      color: #ffffff;
      text-align: center;
      text-transform: uppercase;
      pointer-events: none;
    }

    input {
      height: calc(66 * var(--u));
      margin: 0 0 calc(47 * var(--u));
      padding: 0;
      background: #d1d1d4;
      border-radius: calc(9 * var(--u));
      border: none;
      text-align: center;
      font-family: var(--font-ui);
      font-size: calc(28 * var(--u));
      letter-spacing: inherit;
      color: black;
      transition: background-color linear 0.08s;
      box-shadow: inset 0 0 calc(1 * var(--u)) calc(2 * var(--u)) #ffffff;
      user-select: text;

      &:hover {
        background: #ffffff;
      }

      &:focus {
        outline: none;
        box-shadow:
          inset 0 0 calc(1 * var(--u)) calc(2 * var(--u)) #ffffff,
          0 0 0 calc(1 * var(--u)) #ffffff;
      }
    }

    overwebs-button {
      margin-bottom: calc(47 * var(--u));
    }
  `;

  static override properties = {
    value: {},
  };

  /** The current content of the username field. */
  value = "";

  /** Whether the field holds a non-empty, valid login name. */
  get loginValid(): boolean {
    return this.value !== "" && loginPattern.test(this.value);
  }

  override firstUpdated() {
    this.renderRoot.querySelector("input")?.focus();
  }

  override render() {
    return html`
      <form @submit=${this.onSubmit}>
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          pattern=${LOGIN_PATTERN}
          autocomplete="off"
          autofocus
          .value=${this.value}
          @input=${this.onInput}
        />
        <overwebs-button
          class="login"
          variant="yellow"
          ?disabled=${!this.loginValid}
          @click=${this.submit}
          >Login</overwebs-button
        >
        <overwebs-button
          class="anonymous"
          variant="yellow"
          ?disabled=${this.value !== ""}
          @click=${this.submit}
          >Anonymous</overwebs-button
        >
      </form>
    `;
  }

  private onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
  }

  private onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.submit();
  }

  /** Dispatches `login` for the current value: anonymous when empty, nothing when invalid. */
  submit() {
    let detail: LoginRequest;
    if (this.value === "") {
      detail = { anonymous: true };
    } else if (this.loginValid) {
      const [username = "", battleTag] = this.value.split("#");
      detail = battleTag === undefined ? { username } : { username, battleTag };
    } else {
      return;
    }
    this.dispatchEvent(new CustomEvent("login", { detail, bubbles: true, composed: true }));
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    login: CustomEvent<LoginRequest>;
  }
}
