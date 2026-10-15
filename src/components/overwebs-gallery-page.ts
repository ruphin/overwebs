import { GluonElement, css, html, repeat } from "@gluon/gluon";
import { heroes, type Hero } from "../lib/heroes.js";
import { player, type Player } from "../lib/player.js";
import { back } from "../lib/router.js";

/**
 * The hero gallery: a card per hero with the player's unlock progress. Heroes
 * with main menu backgrounds link to the main page showing their background.
 */
export class OverwebsGalleryPage extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100dvh;
      background: rgba(0, 0, 0, 0.25);
    }

    /* The gallery scrolls below the title; the widgets around it stay put. */
    .content {
      position: absolute;
      inset: calc(312 * var(--u)) 0 0;
      overflow: auto;
    }

    /* Above the cards, which are flex items with a z-index of their own. */
    overwebs-player-widget,
    overwebs-global-button {
      z-index: 3;
    }

    /*
     * The legacy gallery header was 317 design px tall with the text baseline
     * at 313.6px, 108px from the left. The shared title puts its baseline at
     * 95% of its height, so it is 330px tall and overlaps the gallery by the
     * difference (plus the legacy -5px margin).
     */
    overwebs-page-title {
      height: calc(330 * var(--u));
      margin-left: calc(108 * var(--u));
      margin-bottom: calc(-18 * var(--u));
    }

    .hero-gallery {
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 90%;
      margin-top: calc(155 * var(--u));
      margin-left: 4%;
      margin-right: -4%;
    }

    .hero {
      z-index: 1;
      display: block;
      margin: 0 calc(5 * var(--u)) calc(10 * var(--u));
      text-decoration: none;
      animation: fadein 0.2s linear both;
      transition: z-index 0.05s step-end;

      &:hover,
      &:active {
        z-index: 2;
        transition: none;
      }
    }

    @keyframes fadein {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /*
     * Portrait: the title sits under the top bar and the cards fill the width
     * in as many rows as they need, scrolling between the title and the bottom bar.
     */
    @media (orientation: portrait) {
      overwebs-page-title {
        position: absolute;
        top: var(--top-bar);
        left: var(--page-gutter);
        height: calc(150 * var(--u));
        margin: 0;
      }

      /* Clips at the title and the bottom bar, with room for a pressed card (10% a side plus its glow). */
      .content {
        inset: calc(var(--top-bar) + 150 * var(--u)) 0 var(--bottom-bar);
      }

      .hero-gallery {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        margin: 0;
        padding: calc(36 * var(--u)) var(--page-gutter);
      }
    }
  `;

  static override properties = { player: { type: Object } };

  /** The current player; follows the `player` store while connected. */
  player: Player | undefined = undefined;

  override connectedCallback() {
    super.connectedCallback();
    player.subscribe((value) => (this.player = value), { signal: this.disconnectSignal });
  }

  override render() {
    return html`
      <overwebs-page-title text="HERO GALLERY"></overwebs-page-title>
      <div class="content">
        <div class="hero-gallery">
          ${repeat(
            heroes,
            (hero) => hero.id,
            (hero, index) => this.renderHero(hero, index),
          )}
        </div>
      </div>
      <overwebs-player-widget></overwebs-player-widget>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }

  private renderHero(hero: Hero, index: number) {
    const style = `animation-delay: ${index * 0.02}s`;
    const card = html`<overwebs-gallery-hero
      .hero=${hero}
      .unlocks=${this.player?.unlocks[hero.id] ?? 0}
    ></overwebs-gallery-hero>`;
    return hero.background
      ? html`<a class="hero" href=${`/main?background=${hero.id}`} style=${style}>${card}</a>`
      : html`<span class="hero" style=${style}>${card}</span>`;
  }
}
