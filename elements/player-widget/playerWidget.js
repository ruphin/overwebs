import { html, css, LitElement } from "lit";
// import { futura } from "@overwebs/fonts";

const prestigeRanks = ["bronze", "silver", "gold"];
const statusBackground = {
  available: "#7DFF00",
  away: "yellow",
  busy: "red",
};

export default class OverwebsPlayerWidget extends LitElement {
  static properties = {
    player: {},
  };

  constructor() {
    super();
    this.player = {
      name: "Ruphin",
      level: Math.ceil(Math.random() * 1800),
      avatar: "0x02500000000002F7",
      status: "available",
    };
  }

  firstUpdated() {
    this._avatar = this.shadowRoot.getElementById("avatar");
    this._status = this.shadowRoot.getElementById("status");
  }

  updated() {
    this._avatar.style.backgroundImage = `url("${new URL(
      `avatars/${this.player.avatar}.png`,
      import.meta.url
    )}")`;
    this._status.style.background = statusBackground[this.player.status];
  }

  static styles = css`
    :host {
      display: flex;
      position: absolute;
      top: calc(40 / 25.6 * 1vw);
      right: calc(68 / 25.6 * 1vw);
      height: calc(80 / 25.6 * 1vw);
      background: #27354f;
    }
    #status {
      height: 100%;
      width: calc(8 / 25.6 * 1vw);
      background: #7dff00;
    }
    #avatar {
      height: 100%;
      width: calc(80 / 25.6 * 1vw);
      background-size: contain;
      background-repeat: no-repeat;
    }
    .player {
      line-height: 1;
      display: flex;
      align-items: center;
      color: white;
      height: 100%;
      width: calc(386 / 25.6 * 1vw);
    }
    .name {
      margin-left: calc(13 / 25.6 * 1vw);
      font-size: calc(24 / 25.6 * 1vw);
      margin-top: calc(2 / 25.6 * 1vw);
      letter-spacing: calc(0.3 / 25.6 * 1vw);
      font-family: helvetica, "Liberation Sans";
      text-transform: uppercase;
    }
    #levelBox {
      height: calc(24 / 25.6 * 1vw);
      margin-left: calc(8 / 25.6 * 1vw);
      padding-left: calc(8 / 25.6 * 1vw);
      border-radius: calc(3 / 25.6 * 1vw);
      padding-right: calc(2 / 25.6 * 1vw);
      display: flex;
      align-items: center;
    }
    .level {
      font-size: calc(19 / 25.6 * 1vw);
      line-height: calc(24 / 25.6 * 1vw);
      padding-right: calc(6 / 25.6 * 1vw);
      font-family: futura;
      color: white;
      transform: translateY(calc(1 / 25.6 * 1vw));
    }
    .prestige {
      display: inline-block;
      border-radius: calc(3 / 25.6 * 1vw);
      font-family: futura;
      background: #ffffff;
      font-size: calc(20 / 25.6 * 1vw);
      line-height: calc(20 / 25.6 * 1vw);
    }
    .prestige .star {
      display: inline-block;
      transform: translateY(calc(1 / 25.6 * 1vw));
    }
    .prestige .star + .star {
      margin-left: calc(-1 / 25.6 * 1vw);
    }
    #levelBox.bronze {
      background: #a35435;
    }
    #levelBox.bronze .prestige {
      color: #a35435;
    }
    #levelBox.silver {
      background: #b2c1ca;
    }
    #levelBox.silver .prestige {
      color: #21242e;
    }
    #levelBox.silver .level {
      color: #21242e;
    }
    #levelBox.gold {
      background: #d4a92f;
    }
    #levelBox.gold .prestige {
      color: #a05539;
    }
    #levelBox.gold .level {
      color: #6d322d;
    }
  `;

  render() {
    return html`<div id="status"></div>
      <div id="avatar"></div>
      <div class="player">
        <span class="name">${this.player?.name || ""}</span>
        <span id="levelBox" class="${
          prestigeRanks[Math.floor(this.player.level / 600)]
        }">
          <span class="level"
            >${(((this.player?.level || 0) - 1) % 100) + 1}</span
          >
          <span class="prestige">
            ${[
              ...Array(
                Math.trunc((((this.player?.level || 0) % 600) - 1) / 100)
              ),
            ].map((star) => html`<span class="star">★</span>`)}
              
            </template>
          </span>
        </span>
      </div>`;
  }
}
