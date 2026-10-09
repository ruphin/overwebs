import { GluonElement, css, html } from "@gluon/gluon";
import type { BackgroundSelection } from "../lib/backgrounds.js";
import { heroById } from "../lib/heroes.js";
import { player, type Player } from "../lib/player.js";
import type { MenuItem } from "./overwebs-main-menu.js";

const menuItems: readonly MenuItem[] = [
  { label: "Play", href: "/play", primary: true },
  { label: "Training", href: "/training", primary: true },
  { label: "Hero Gallery", href: "/hero-gallery", primary: true },
  { label: "Loot Box", href: "/loot", primary: true },
  { label: "Social", href: "/social" },
  { label: "Career Profile", href: "/career" },
  { label: "Options", href: "/options" },
  { label: "Exit Game", href: "/exit" },
];

/**
 * The main menu page: the player widget, the main menu, and the name and
 * unlock count of the hero in the background.
 */
export class OverwebsMainPage extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
    }

    .hero {
      opacity: 0.9;
      position: absolute;
      right: calc(51.2 * var(--u));
      top: calc(905 * var(--u));
      text-align: right;
      z-index: 0;
    }

    .name,
    .nameShadow,
    .nameShadow2 {
      padding-right: calc(76.8 * var(--u));
      font-family: var(--font-display);
      line-height: 1;
      font-size: calc(114 * var(--u));
      color: transparent;
    }

    .name {
      background: linear-gradient(white 0, white 50%, white 50%, #bdbfc0);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .nameShadow {
      position: absolute;
      right: 0;
      z-index: -1;
      -webkit-text-stroke: calc(3.264 * var(--u)) rgba(0, 0, 0, 0.15);
      color: white;
    }

    .nameShadow2 {
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
      -webkit-text-stroke: calc(3.84 * var(--u)) transparent;
      color: white;
    }

    .unlocks,
    .unlocksShadow {
      font-family: var(--font-ui);
      font-size: calc(36 * var(--u));
      text-transform: uppercase;
      padding-right: calc(70 * var(--u));
    }

    .unlocks {
      color: rgba(255, 255, 255, 0.8);
      margin-top: calc(2 * var(--u));

      .unlocked {
        color: white;
      }
    }

    .unlocksShadow {
      color: rgba(0, 0, 0, 0);
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: -1;
      -webkit-text-stroke: calc(4.544 * var(--u)) rgba(0, 0, 0, 0.15);
    }
  `;

  static override properties = {
    selection: { type: Object },
    player: { type: Object },
  };

  /** The background set on screen; `selection.hero` is the hero shown. */
  selection: BackgroundSelection | undefined = undefined;
  /** The current player, followed from the `player` store while connected. */
  player: Player | undefined = undefined;

  override connectedCallback() {
    super.connectedCallback();
    player.subscribe((value) => (this.player = value), { signal: this.disconnectSignal });
  }

  override render() {
    const hero = this.selection ? heroById.get(this.selection.hero) : undefined;
    const name = hero?.name ?? "";
    const unlockable = hero?.unlockable ?? 0;
    const unlocked = hero ? Math.min(this.player?.unlocks[hero.id] ?? 0, unlockable) : 0;
    const unlocks = html`<span class="unlocked">${unlocked}</span>/${unlockable} unlocks`;
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-main-menu .items=${menuItems}></overwebs-main-menu>
      <div class="hero">
        <div class="nameShadow" aria-hidden="true">${name}</div>
        <div class="nameShadow2" aria-hidden="true">${name}</div>
        <div class="name">${name}</div>
        <div class="unlocks">${unlocks}</div>
        <div class="unlocksShadow" aria-hidden="true">${unlocks}</div>
      </div>
    `;
  }
}
