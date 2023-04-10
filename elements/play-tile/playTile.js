import { html, css, unsafeCSS, LitElement } from "lit";

// TODO: Abstract this somewhere
const relativeUrl = (path) => {
  const { url } = import.meta;
  return unsafeCSS(`${url.substring(0, url.lastIndexOf("/"))}/${path}`);
};

export default class OverwebsMainPage extends LitElement {
  static styles = css`
    :host {
      position: relative;
      height: calc(684 / 25.6 * 1vw);
      width: calc(417 / 25.6 * 1vw);
      background-size: contain;
      background-position: center bottom;
      background-repeat: no-repeat;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      align-items: flex-end;
      justify-content: flex-end;
      transition: transform 0.1s linear;
      text-align: center;
      /* cursor: url(/images/overwatch.cur), auto; */
    }
    :host([quick-play]) {
      background-image: url(${relativeUrl("images/quickPlay.png")});
    }
    :host([quick-play]) .icon {
      background-image: url(${relativeUrl("images/icon-quickPlay.png")});
    }
    :host([arcade]) {
      background-image: url(${relativeUrl("images/arcade.png")});
    }
    :host([arcade]) .icon {
      background-image: url(${relativeUrl("images/icon-arcade.png")});
    }
    :host([play-vs-ai]) {
      background-image: url(${relativeUrl("images/playVsAi.png")});
    }
    :host([play-vs-ai]) .icon {
      background-image: url(${relativeUrl("images/icon-playVsAi.png")});
    }
    :host([competitive-play]) {
      background-image: url(${relativeUrl("images/competitivePlay.png")});
    }
    :host([competitive-play]) .icon {
      background-image: url(${relativeUrl("images/icon-competitivePlay.png")});
    }
    :host([tutorial]) {
      background-image: url(${relativeUrl("images/tutorial.png")});
    }
    :host([tutorial]) .icon {
      background-image: url(${relativeUrl("images/icon-tutorial.png")});
    }
    :host([practice-range]) {
      background-image: url(${relativeUrl("images/practiceRange.png")});
    }
    :host([practice-range]) .icon {
      background-image: url(${relativeUrl("images/icon-practiceRange.png")});
    }
    :host([custom-game]) {
      background-image: url(${relativeUrl("images/customGame.png")});
    }
    :host([custom-game]) .icon {
      background-image: url(${relativeUrl("images/icon-customGame.png")});
    }
    :host([easy-ai]) {
      background-image: url(${relativeUrl("images/easyAI.png")});
    }
    :host([medium-ai]) {
      background-image: url(${relativeUrl("images/mediumAI.png")});
    }
    :host([hard-ai]) {
      background-image: url(${relativeUrl("images/hardAI.png")});
    }
    :host([info]) .content .hotkey,
    :host([info]) .content .info {
      display: flex;
    }
    :host(:hover) {
      box-shadow: 0 0 0 calc(8.5 / 1.1 / 25.6 * 1vw) #ffffff;
      transform: scale(1.1);
      z-index: 2;
    }
    .content {
      position: relative;
      height: calc(330 / 25.6 * 1vw);
      width: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
      background: radial-gradient(
        ellipse farthest-corner at 50% -15%,
        #ebebee,
        #e4e4e8 50%,
        #d6d5dd
      );
    }
    .content .icon,
    .content ::slotted([slot="icon"]) {
      margin-top: calc(30 / 25.6 * 1vw);
      height: calc(68 / 25.6 * 1vw);
      width: calc(68 / 25.6 * 1vw);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .content ::slotted([slot="title"]) {
      font-family: big-noodle-too-oblique;
      color: #28354f;
      font-size: calc(68 / 25.6 * 1vw);
      line-height: 1;
      text-transform: uppercase;
      transform: translateX(calc(-3 / 25.6 * 1vw));
      margin-top: calc(22 / 25.6 * 1vw);
    }
    .content ::slotted([slot="description"]) {
      width: 90%;
      font-family: helvetica;
      color: #5e7ba5;
      font-size: calc(20 / 25.6 * 1vw);
      line-height: 1.1;
      text-transform: uppercase;
      margin-top: calc(18 / 25.6 * 1vw);
    }
    .content .hotkey {
      position: absolute;
      bottom: 0;
      right: calc(20 / 25.6 * 1vw);
      height: calc(46 / 25.6 * 1vw);
      width: calc(50 / 25.6 * 1vw);
      background: #323e57;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .content .hotkey .rmb {
      width: calc(26 / 25.6 * 1vw);
      height: calc(37 / 25.6 * 1vw);
      background: url("images/rmb.png") center center no-repeat;
      background-size: contain;
    }
    .content .info {
      position: absolute;
      bottom: 0;
      right: calc(73 / 25.6 * 1vw);
      height: calc(46 / 25.6 * 1vw);
      width: calc(50 / 25.6 * 1vw);
      background: #323e57;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .content .info .i {
      width: calc(34 / 25.6 * 1vw);
      height: calc(34 / 25.6 * 1vw);
      line-height: calc(34 / 25.6 * 1vw);
      font-size: calc(30 / 25.6 * 1vw);
      font-family: futura;
      color: #28354f;
      text-align: center;
      background: white;
      border-radius: 100%;
    }
  `;

  render() {
    return html`<div class="content">
        <slot name="icon"><div class="icon"></div></slot>
        <slot name="title"></slot>
        <slot name="description"></slot>
        <div class="hotkey">
          <div class="rmb"></div>
        </div>
        <div class="info">
          <div class="i">i</div>
        </div>
      </div>
      <overwebs-game-state id="game-state"></overwebs-game-state>
      <overwebs-global-button
        id="backButton"
        action="back"
      ></overwebs-global-button>`;
  }
}
