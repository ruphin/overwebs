import { GluonElement, css, html } from "@gluon/gluon";
import {
  avatarUrl,
  displayLevel,
  player,
  prestigeRank,
  prestigeStars,
  type Player,
  type PlayerStatus,
} from "../lib/player.js";

const statusColors: Record<PlayerStatus, string> = {
  available: "#7DFF00",
  away: "yellow",
  busy: "red",
};

/**
 * The player card in the top right corner: status bar, avatar, name, and the
 * level box with prestige stars. Follows the `player` store while connected.
 */
export class OverwebsPlayerWidget extends GluonElement {
  static override styles = css`
    :host {
      display: flex;
      position: absolute;
      top: calc(40 * var(--u));
      right: calc(68 * var(--u));
      height: calc(80 * var(--u));
      background: #27354f;
    }

    .status {
      width: calc(8 * var(--u));
      background: #7dff00;
    }

    .avatar {
      width: calc(80 * var(--u));
      background: no-repeat center / contain;
    }

    .player {
      display: flex;
      align-items: center;
      gap: calc(10 * var(--u));
      box-sizing: border-box;
      width: calc(386 * var(--u));
      padding-left: calc(13 * var(--u));
      line-height: 1;
      color: white;
    }

    .name {
      margin-top: calc(1 * var(--u));
      font-family: var(--font-text);
      font-size: calc(24 * var(--u));
      letter-spacing: calc(0.3 * var(--u));
      text-transform: uppercase;
    }

    .level-box {
      --rank: #a35435;
      display: flex;
      align-items: center;
      height: calc(24 * var(--u));
      padding-inline: calc(8 * var(--u)) calc(2 * var(--u));
      border-radius: calc(3 * var(--u));
      background: var(--rank);

      &.silver {
        --rank: silver;
      }

      &.gold {
        --rank: gold;
      }
    }

    .level {
      padding-right: calc(6 * var(--u));
      font-family: var(--font-ui);
      font-size: calc(19 * var(--u));
      line-height: calc(24 * var(--u));
      color: white;
      transform: translateY(calc(1 * var(--u)));
    }

    .prestige {
      display: inline-flex;
      border-radius: calc(3 * var(--u));
      background: white;
      color: var(--rank);
      font-family: var(--font-ui);
      font-size: calc(24 * var(--u));
      line-height: calc(20 * var(--u));
    }

    .star {
      transform: translateY(calc(1 * var(--u)));

      & + .star {
        margin-left: calc(-2 * var(--u));
      }
    }
  `;

  static override properties = { player: { type: Object } };

  player: Player | undefined = undefined;

  override connectedCallback() {
    super.connectedCallback();
    player.subscribe((value) => (this.player = value), { signal: this.disconnectSignal });
  }

  override render() {
    const current = this.player;
    const level = current?.level ?? 0;
    const status = `background: ${statusColors[current?.status ?? "available"] ?? statusColors.available}`;
    const avatar = current?.avatar ? `background-image: url(${avatarUrl(current.avatar)})` : "";
    const stars = Array.from(
      { length: prestigeStars(level) },
      () => html`<span class="star">★</span>`,
    );
    return html`
      <div class="status" style=${status}></div>
      <div class="avatar" style=${avatar}></div>
      <div class="player">
        <span class="name">${current?.name ?? ""}</span>
        <span class=${`level-box ${prestigeRank(level)}`}>
          <span class="level">${displayLevel(level)}</span>
          <span class="prestige">${stars}</span>
        </span>
      </div>
    `;
  }
}
