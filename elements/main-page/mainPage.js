import { html, css, LitElement } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";

import OverwebsMainMenu from "@overwebs/main-menu";
import OverwebsPlayerWidget from "@overwebs/player-widget";

export default class OverwebsMainPage extends ScopedElementsMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: auto;
      width: 100vw;
      height: 100vh;
    }
    .searching-spinner {
      margin-left: calc(40 / 25.6 * 1vw);
      height: calc(80 / 25.6 * 1vw);
      width: calc(80 / 25.6 * 1vw);
    }
    .hero {
      opacity: 0.9;
      position: absolute;
      right: 2vw;
      top: calc(905 / 25.6 * 1vw);
      text-align: right;
      z-index: 0;
    }
    .hero .name,
    .hero .nameShadow,
    .hero .nameShadow2 {
      padding-right: 3vw;
      font-family: big-noodle-too-oblique;
      line-height: 1;
      font-size: calc(114 / 25.6 * 1vw);
      color: transparent;
    }
    .hero .name {
      background: linear-gradient(white 0, white 50%, white 50%, #bdbfc0);
      -webkit-background-clip: text;
      background-clip: text;
    }
    .hero .nameShadow {
      color: transparent;
      position: absolute;
      right: 0;
      z-index: -1;
      -webkit-text-stroke: 0.1275vw rgba(0, 0, 0, 0.15);
      color: white;
    }
    .hero .nameShadow2 {
      color: white;
      position: absolute;
      right: 0;
      z-index: -2;
      background: linear-gradient(
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0) 10%,
        rgba(219, 155, 143, 0.85) 16%,
        rgba(0, 0, 0, 0.15)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-stroke: 0.15vw transparent;
      color: white;
    }
    .hero .unlocks,
    .hero .unlocksShadow {
      font-family: futura;
      font-size: calc(36 / 25.6 * 1vw);
      text-transform: uppercase;
      padding-right: calc(70 / 25.6 * 1vw);
    }
    .hero .unlocks {
      color: rgba(255, 255, 255, 0.8);
      margin-top: calc(2 / 25.6 * 1vw);
    }
    .hero .unlocks .unlocked {
      color: white;
    }
    .hero .unlocksShadow {
      color: rgba(0, 0, 0, 0);
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: -1;
      -webkit-text-stroke: 0.1775vw rgba(0, 0, 0, 0.15);
    }
  `;

  static get scopedElements() {
    return {
      "overwebs-player-widget": OverwebsPlayerWidget,
      "overwebs-main-menu": OverwebsMainMenu,
    };
  }

  // TODO: Unlocks
  render() {
    return html`<overwebs-player-widget></overwebs-player-widget>
      <overwebs-main-menu>
        <a href="/play" data-text="Play">Play</a>
        <!-- <a href="" class="disabled" data-text="Searching">Searching</a> -->
        <a href="/training" data-text="Training">Training</a>
        <a href="/gallery" data-text="Hero Gallery">Hero Gallery</a>
        <a href="/loot" data-text="Loot Box">Loot Box</a>
        <a href="/social" data-text="Social" slot="sub">Social</a>
        <a href="/career" data-text="Career Profile" slot="sub"
          >Career Profile</a
        >
        <a href="/options" data-text="Options" slot="sub">Options</a>
        <a href="/exit" data-text="Exit Game" slot="sub">Exit Game</a>
      </overwebs-main-menu>
      <div class="hero">
        <div class="nameShadow">Soldier 76</div>
        <div class="nameShadow2">Soldier 76</div>
        <div class="name">Soldier 76</div>
        <div class="unlocks"><span class="unlocked">4</span>/23 unlocks</div>
        <div class="unlocksShadow">
          <span class="unlocked">4</span>/23 unlocks
        </div>
      </div>`;
  }
}

// Polymer({
//   is: "overwebs-main-page",

//   _hero: function (heroData, backgroundSelection) {
//     let hero = backgroundSelection.split("/").slice(0, -1).pop();
//     return (this.heroData[hero] && this.heroData[hero].name) || "";
//   },

//   _unlocked: function (playerData, heroData, backgroundSelection) {
//     let hero = backgroundSelection.split("/").slice(0, -1).pop();
//     if (playerData.unlocks && heroData[hero]) {
//       return Math.min(playerData.unlocks[hero], heroData[hero].unlockable);
//     } else {
//       return 0;
//     }
//   },

//   _unlockable: function (heroData, backgroundSelection) {
//     let hero = backgroundSelection.split("/").slice(0, -1).pop();
//     return (heroData[hero] && heroData[hero].unlockable) || 0;
//   },
// });
