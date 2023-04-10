import { html, css, LitElement } from "lit";

const injectedParentStyles = new CSSStyleSheet();
{
  // Scope to override `css` tag for syntax highlighting
  let css = (styleStrings) => styleStrings[0];
  injectedParentStyles.replace(css`
    overwebs-main-menu > a {
      text-decoration: none;
      padding-left: 2.5175vw;
      margin-top: 0.3675vw;
      position: relative;
      z-index: 0;
      color: white;
      font-family: big-noodle-too-oblique;
      line-height: 1;
      font-size: 3.9375vw;
    }
    overwebs-main-menu > a::before {
      content: attr(data-text);
      position: absolute;
      z-index: -1;
      color: rgba(255, 255, 255, 0);
      -webkit-text-stroke: 0.1775vw rgba(0, 0, 0, 0.15);
    }
    overwebs-main-menu > a:focus {
      outline: none;
    }
    overwebs-main-menu > a:not(.disabled):hover {
      padding-left: 5.2025vw;
      transform: scale(1.1);
    }
    overwebs-main-menu > a.disabled {
      color: rgba(255, 255, 255, 0.6);
    }

    overwebs-main-menu > a[slot="sub"] {
      padding-left: 2.5825vw;
      margin-top: 0.5125vw;
      color: rgba(255, 255, 255, 0.95);
      font-family: futura;
      font-size: 1.455vw;
      text-transform: uppercase;
    }
    overwebs-main-menu > a[slot="sub"]::before {
      color: rgba(0, 0, 0, 0);
      white-space: nowrap;
      -webkit-text-stroke: 0.1175vw rgba(154, 166, 195, 0.8);
    }
    overwebs-main-menu > a[slot="sub"]:hover {
      padding-left: 3.2275vw;
    }
  `);
}

export default class OverwebsMainMenu extends LitElement {
  firstUpdated() {
    // We have to inject the slotted link styles to the scope outside
    // Because it is not possible to style pseudo elements of slotted content
    const parent = this.getRootNode();
    parent.adoptedStyleSheets = [
      ...parent.adoptedStyleSheets,
      injectedParentStyles,
    ];
  }
  static styles = css`
    .main-menu {
      display: flex;
      flex-direction: column;
      margin-top: 15.85vw;
      width: 24vw;
    }

    .searching-spinner {
      margin-left: calc(40 / 25.6 * 1vw);
      height: calc(80 / 25.6 * 1vw);
      width: calc(80 / 25.6 * 1vw);
    }
    .sub-menu {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: -0.05vw;
      width: 30vw;
    }
  `;

  render() {
    return html`<div class="main-menu">
        <slot></slot>
      </div>
      <div class="sub-menu">
        <slot name="sub"></slot>
      </div>`;
  }
}
