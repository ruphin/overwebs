import { html, css, LitElement } from "lit";
// import { futura } from "@overwebs/fonts";

export default class OverwebsButton extends LitElement {
  static properties = {
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      text-shadow: 0 0 calc(8 / 25.6 * 1vw) rgba(255, 255, 255, 0.4),
        0 0 calc(2 / 25.6 * 1vw) rgba(255, 255, 255, 0.8);
      font-family: futura;
      text-transform: uppercase;
      border-radius: calc(3 / 25.6 * 1vw);
      opacity: 0.95;
    }
    :host(:focus) {
      outline: none;
    }
    :host([yellow]) {
      height: calc(76 / 25.6 * 1vw);
      padding: 0 calc(66 / 25.6 * 1vw);
      background: rgba(240, 177, 64, 0.9);
      box-shadow: inset 0 0 calc(3 / 25.6 * 1vw) calc(1 / 25.6 * 1vw) #d09734,
        0 0 0 calc(1 / 25.6 * 1vw) #785224,
        0 0 calc(8 / 25.6 * 1vw) calc(1 / 25.6 * 1vw) #785224;
      font-size: calc(46 / 25.6 * 1vw);
    }
    :host([yellow]:hover),
    :host([yellow]:focus) {
      box-shadow: 0 0 0 calc(3 / 1.1 / 25.6 * 1vw) #ffffff;
    }
    :host([yellow]:hover) {
      background: rgba(255, 194, 70, 0.9);
    }
    :host([blue]) {
      height: calc(48 / 25.6 * 1vw);
      padding: 0 calc(25 / 25.6 * 1vw);
      background: rgba(41, 139, 206, 0.9);
      box-shadow: 0 0 0 calc(1 / 25.6 * 1vw) rgba(33, 95, 144, 0.4),
        0 0 calc(6 / 25.6 * 1vw) calc(1 / 25.6 * 1vw) rgba(33, 95, 144, 0.4);
      text-shadow: 0 0 calc(5 / 25.6 * 1vw) rgba(255, 255, 255, 0.3);
      border-radius: calc(2 / 25.6 * 1vw);
      font-size: calc(28 / 25.6 * 1vw);
    }
    :host([blue]:hover),
    :host([blue]:focus) {
      box-shadow: 0 0 0 calc(3 / 1.1 / 25.6 * 1vw) #ffffff;
    }
    :host([blue]:hover) {
      background: rgba(45, 153, 226, 0.9);
    }
    :host([purple]) {
      height: calc(48 / 25.6 * 1vw);
      padding: 0 calc(25 / 25.6 * 1vw);
      background: rgba(178, 0, 255, 0.9);
      box-shadow: 0 0 0 calc(1 / 25.6 * 1vw) rgba(33, 95, 144, 0.4),
        0 0 calc(6 / 25.6 * 1vw) calc(1 / 25.6 * 1vw) rgba(33, 95, 144, 0.4);
      text-shadow: 0 0 calc(5 / 25.6 * 1vw) rgba(255, 255, 255, 0.3);
      border-radius: calc(2 / 25.6 * 1vw);
      font-size: calc(28 / 25.6 * 1vw);
    }
    :host([purple]:hover),
    :host([purple]:focus) {
      box-shadow: 0 0 0 calc(3 / 1.1 / 25.6 * 1vw) #ffffff;
    }
    :host([purple]:hover) {
      background: rgba(196, 5, 255, 0.9);
    }
    :host([disabled]),
    :host([disabled]:hover) {
      background: transparent;
      box-shadow: inset 0 0 calc(8 / 25.6 * 1vw) rgba(151, 172, 181, 0.4),
        0 0 calc(8 / 25.6 * 1vw) rgba(151, 172, 181, 0.4),
        inset 0 0 calc(3 / 25.6 * 1vw) rgba(151, 172, 181, 0.7),
        0 0 calc(2 / 25.6 * 1vw) calc(1 / 25.6 * 1vw) #97acb5;
      color: rgba(141, 166, 181, 0.8);
      text-shadow: 0 0 calc(8 / 25.6 * 1vw) rgba(141, 166, 181, 0.4),
        0 0 calc(2 / 25.6 * 1vw) rgba(141, 166, 181, 0.8);
    }
    :host([block]) {
      display: flex;
      padding: 0;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }

  // If the button is focused it should fire clicks if enter or space is pressed
  firstUpdated() {
    this.addEventListener("keydown", ({ key }) => {
      if (key === "Enter" || key === " ") {
        this.click();
      }
    });
  }

  updated() {
    // If the button is disabled it should not be focusable
    if (this.disabled) {
      this.removeAttribute("tabindex");
    } else {
      this.setAttribute("tabindex", "0");
    }
  }
}
