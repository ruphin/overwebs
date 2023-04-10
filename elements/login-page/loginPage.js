import { html, css, LitElement } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import OverwebsButton from "@overwebs/button";

export default class OverwebsMainPage extends ScopedElementsMixin(LitElement) {
  static properties = {
    inputValue: {},
  };

  constructor() {
    super();
    this.inputValue = "";
  }

  static styles = css`
    :host {
      display: flex;
      flex-flow: column;
      position: relative;
      overflow: auto;
      width: 100vw;
      height: 100vh;
      align-items: center;
      justify-content: flex-end;
      letter-spacing: calc(1 / 25.6 * 1vw);
    }
    form {
      width: calc(400 / 25.6 * 1vw);
      display: flex;
      flex-flow: column;
      margin-bottom: calc(88 / 25.6 * 1vw);
    }
    label {
      margin-bottom: calc(14 / 25.6 * 1vw);
      font-family: futura;
      font-size: calc(24 / 25.6 * 1vw);
      color: #ffffff;
      text-align: center;
      text-transform: uppercase;
      pointer-events: none;
    }
    input {
      height: calc(66 / 25.6 * 1vw);
      margin-bottom: calc(47 / 25.6 * 1vw);
      background: #d1d1d4;
      border-radius: calc(9 / 25.6 * 1vw);
      border: none;
      text-align: center;
      font-family: futura;
      font-size: calc(28 / 25.6 * 1vw);
      transition: background-color linear 0.08s;
      box-shadow: inset 0 0 calc(1 / 25.6 * 1vw) calc(2 / 25.6 * 1vw) #ffffff;
    }
    input:hover {
      background: #ffffff;
    }
    input:focus {
      outline: none;
      box-shadow: inset 0 0 calc(1 / 25.6 * 1vw) calc(2 / 25.6 * 1vw) #ffffff,
        0 0 0 calc(1 / 25.6 * 1vw) #ffffff;
    }
    overwebs-button {
      margin-bottom: calc(47 / 25.6 * 1vw);
    }
  `;

  static get scopedElements() {
    return {
      "overwebs-button": OverwebsButton,
    };
  }

  render() {
    return html`<form @submit="${this.login}">
      <label for="username">Username</label>
      <input type="text" @input=${({ target }) =>
        this.inputChanged(target, target.value)} autofocus></input>
      <overwebs-button yellow @click="${this.login}" .disabled="${
      this.inputValue === ""
    }">Login</overwebs-button>
    </form>`;
  }

  inputChanged(input, value) {
    if (/^([a-zA-Z]+(#[0-9]*)?)?$/.test(value)) {
      this.inputValue = value;
    } else {
      input.value = this.inputValue;
    }
  }

  login(e) {
    e.preventDefault();
    if (this.inputValue !== "") {
      let [username, battleTag] = this.inputValue.split("#");
      this.dispatchEvent(
        new CustomEvent("login", {
          detail: { username, battleTag },
        })
      );
    }
  }
}
