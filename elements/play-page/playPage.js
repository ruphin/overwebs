import { html, css, LitElement } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";

import OverwebsPlayerWidget from "@overwebs/player-widget";
import OverwebsPlayTile from "@overwebs/play-tile";

export default class OverwebsMainPage extends ScopedElementsMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.25);
    }
    a {
      text-decoration: none;
    }
    .header {
      position: absolute;
      top: calc(154 / 25.6 * 1vw);
      left: calc(120 / 25.6 * 1vw);
      height: calc(230 / 25.6 * 1vw);
      width: 50%;
      animation-duration: 0.6s;
      animation-name: headermove;
      animation-iteration-count: 1;
      animation-timing-function: ease-out;
      animation-direction: normal;
    }
    .header #text {
      font-family: big-noodle-too-oblique;
      font-size: calc(266 / 25.6 * 1vw);
    }
    .modes {
      margin-top: calc(378 / 25.6 * 1vw);
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .modes > * {
      animation-duration: 0.2s;
      animation-name: fadein;
      animation-iteration-count: 1;
      animation-timing-function: linear;
      animation-direction: normal;
      animation-fill-mode: both;
      margin-right: calc(16 / 25.6 * 1vw);
    }
    .modes > *:nth-of-type(2) {
      animation-delay: 0.05s;
    }
    .modes > *:nth-of-type(3) {
      animation-delay: 0.1s;
    }
    .modes > *:nth-of-type(4) {
      animation-delay: 0.15s;
    }
    .modes > *:nth-of-type(5) {
      animation-delay: 0.2s;
    }
    .modes > *:last-child {
      margin-right: 0;
    }
    .modes > *:hover {
      z-index: 2;
    }
    @keyframes fadein {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes headermove {
      from {
        opacity: 0;
        transform: translateY(calc(calc(30 / 25.6 * 1vw)));
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  static get scopedElements() {
    return {
      "overwebs-player-widget": OverwebsPlayerWidget,
      "overwebs-play-tile": OverwebsPlayTile,
    };
  }

  render() {
    return html` <overwebs-player-widget></overwebs-player-widget>
      <svg class="header" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fillgradient" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="#ffffff" offset="0" stop-opacity=".9" />
            <stop stop-color="#ffffff" offset="1" stop-opacity="0.1" />
          </linearGradient>
          <linearGradient id="outlinegradient" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="#4C5C76" offset="0" stop-opacity="0.6" />
            <stop stop-color="#4C5C76" offset="1" stop-opacity="0.3" />
          </linearGradient>
        </defs>
        <g>
          <text
            id="text"
            x="0"
            y="95%"
            stroke-width="0.12625vw"
            stroke-linejoin="round"
            stroke-alignment="outside"
            stroke="url(#outlinegradient)"
            fill="url(#fillgradient)"
          >
            Play
          </text>
        </g>
      </svg>
      <div class="modes">
        <overwebs-play-tile id="quick-play" quick-play>
          <div slot="title">Quick Play</div>
          <div slot="description">
            Jump into a game against other players of your skill level.
          </div>
        </overwebs-play-tile>
        <a href="/arcade">
          <overwebs-play-tile arcade>
            <div slot="title">Arcade</div>
            <div slot="description">
              New game modes! New Rules! New maps! Enter the arcade.
            </div>
          </overwebs-play-tile>
        </a>
        <a href="/competitive">
          <overwebs-play-tile competitive-play info>
            <div slot="title">Competitive Play</div>
            <div slot="description">
              Compete against other players and work your way up the ranks.
            </div>
          </overwebs-play-tile>
        </a>
        <a href="/vs-ai">
          <overwebs-play-tile play-vs-ai>
            <div slot="title">Play vs. AI</div>
            <div slot="description">
              Hone your skills against a team of AI-controlled heroes.
            </div>
          </overwebs-play-tile>
        </a>
        <overwebs-play-tile custom-game>
          <div slot="title">Custom Game</div>
          <div slot="description">
            Change the rules and play a game with your friends or AI.
          </div>
        </overwebs-play-tile>
      </div>
      <overwebs-game-state id="game-state"></overwebs-game-state>
      <overwebs-global-button
        id="backButton"
        action="back"
      ></overwebs-global-button>`;
  }
}

// Polymer({
//   is: 'overwebs-play-page',
//   ready: function() {
//     this.$.backButton.onclick = (event) => {
//       // this.$.season2.classList.remove('visible');
//       event.stopPropagation();
//       history.back();
//     };
//     this.time = 0

//     // this.$.overlayButton.onclick = (event) => {
//     //   this.$.season2.classList.remove('visible');
//     //   event.stopPropagation();
//     //   history.back();
//     // };
//     // this.$.seasonInfoButton.onclick = (event) => {
//     //   this.$.season2.classList.add('visible');
//     // };
//     this.$['quick-play'].onclick = () => {
//       this.dispatchEvent(new CustomEvent('queue', { 'detail': {'queue-type': 'Quick Play'} }));
//     };
//   },
// });
