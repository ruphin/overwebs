import { GluonElement, css, html } from "@gluon/gluon";
import type { PropertyValues } from "@gluon/gluon";
import { heroPortrait, type Hero } from "../lib/heroes.js";

/**
 * The skewed hero card of the hero gallery: portrait, name, and unlock
 * progress. Heroes with main menu backgrounds get the glowing "NEW!" badge.
 */
export class OverwebsGalleryHero extends GluonElement {
  static override styles = css`
    @keyframes glow {
      0%,
      5% {
        box-shadow:
          0 0 0 calc(5 * var(--u)) rgba(255, 255, 192, 0.8),
          inset 0 0 0 0 rgba(255, 255, 192, 0.8);
      }
      100% {
        box-shadow:
          0 0 0 calc(5 * var(--u)) rgba(255, 255, 192, 0.8),
          inset 0 0 0 calc(5 * var(--u)) rgba(255, 255, 192, 0.8);
      }
    }

    @keyframes hoverglow {
      0%,
      5% {
        box-shadow:
          0 0 0 calc(4 * var(--u)) #ffffff,
          inset 0 0 0 calc(1 * var(--u)) rgba(255, 255, 192, 0.9),
          inset 0 0 0 calc(2 * var(--u)) rgba(255, 255, 192, 0.7),
          inset 0 0 0 calc(3 * var(--u)) rgba(255, 255, 192, 0.1),
          inset 0 0 0 calc(4 * var(--u)) rgba(255, 255, 192, 0.075),
          inset 0 0 0 calc(5 * var(--u)) rgba(255, 255, 192, 0.05),
          inset 0 0 0 calc(6 * var(--u)) rgba(255, 255, 192, 0.025);
      }
      100% {
        box-shadow:
          0 0 0 calc(4 * var(--u)) #ffffff,
          inset 0 0 0 calc(1 * var(--u)) rgba(255, 246, 181, 0.9),
          inset 0 0 0 calc(2 * var(--u)) rgba(255, 246, 181, 0.7),
          inset 0 0 0 calc(3 * var(--u)) rgba(255, 246, 181, 0.1),
          inset 0 0 0 calc(4 * var(--u)) rgba(255, 246, 181, 0.075),
          inset 0 0 0 calc(5 * var(--u)) rgba(255, 246, 181, 0.05),
          inset 0 0 0 calc(6 * var(--u)) rgba(255, 246, 181, 0.025);
      }
    }

    @keyframes newshine {
      0% {
        opacity: 0;
      }
      1% {
        opacity: 0.1;
      }
      35% {
        opacity: 0.71;
      }
      50% {
        opacity: 0.65;
      }
      65% {
        opacity: 0.7;
      }
      99% {
        opacity: 0.1;
      }
      100% {
        opacity: 0;
      }
    }

    :host {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: calc(186 * var(--u));
      height: calc(263 * var(--u));
      border: calc(5 * var(--u)) solid #dddde3;
      border-radius: calc(5 * var(--u));
      text-align: center;
      transform: skewX(-15deg);
      transition: transform 0.15s ease-in-out;
    }

    @media (hover: hover) {
      :host(:hover) {
        border-color: #ffffff;
        transform: skewX(-15deg) scale(1.2);
        transition: transform 0.08s ease-out;

        .glow {
          animation-name: hoverglow;
        }
      }
    }

    /* Touch screens: the same while the card is pressed; the link follows on release. */
    @media (hover: none) {
      :host(:active) {
        border-color: #ffffff;
        transform: skewX(-15deg) scale(1.2);
        transition: transform 0.08s ease-out;

        .glow {
          animation-name: hoverglow;
        }
      }
    }

    :host([new]) {
      .glow {
        display: block;
      }
      .new {
        display: flex;
      }
    }

    .portrait {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: top;
    }

    .new {
      position: relative;
      display: none;
      justify-content: center;
      align-items: center;
      box-sizing: content-box;
      width: calc(57 * var(--u));
      height: calc(26 * var(--u));
      margin-top: calc(12 * var(--u));
      margin-right: calc(12 * var(--u));
      padding-top: calc(2 * var(--u));
      border-radius: calc(5 * var(--u));
      background: rgba(0, 0, 0, 0.7);
      box-shadow:
        0 0 0 calc(3 * var(--u)) rgba(0, 0, 0, 0.7),
        inset 0 0 0 calc(1 * var(--u)) rgba(255, 246, 181, 0.3),
        inset 0 0 0 calc(2 * var(--u)) rgba(254, 162, 30, 0.9),
        inset 0 0 0 calc(3 * var(--u)) rgba(254, 162, 30, 0.2);
      color: #ffff0f;
      font-family: var(--font-ui);
      font-size: calc(18 * var(--u));
      text-transform: uppercase;
      text-shadow: calc(0.6 * var(--u)) calc(0.8 * var(--u)) #000;
    }

    .flare {
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(100 * var(--u));
      height: calc(100 * var(--u));
      transform: translate(-50%, -50%);
      background: url("/images/newFlare.png") center / 128% no-repeat;
      pointer-events: none;
      animation: newshine 4s ease-in-out infinite;
    }

    .glow {
      display: none;
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: calc(5 * var(--u));
      animation: glow 1.5s ease-in-out infinite alternate;
    }

    .content {
      display: flex;
      flex-direction: column;
      margin-top: auto;
      width: 100%;
      height: calc(85 * var(--u));
      background: #e3e3e7;
    }

    .name {
      padding-top: calc(10 * var(--u));
      line-height: calc(44 * var(--u));
      color: #28354f;
      font-family: var(--font-display);
      font-size: calc(36 * var(--u));
      letter-spacing: calc(1 * var(--u));
      text-transform: uppercase;
      transform: skewX(15deg) translateX(calc(-6 * var(--u)));
    }

    .progress {
      position: relative;
      display: flex;
      height: calc(32 * var(--u));
      background: #d2dbe6;
    }

    .completion {
      height: 100%;
    }

    .unlocked {
      position: absolute;
      top: calc(2 * var(--u));
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: calc(30 * var(--u));
      color: #ffffff;
      -webkit-text-stroke: calc(1 * var(--u)) rgba(0, 0, 0, 0.35);
      font-family: var(--font-ui);
      font-size: calc(25 * var(--u));
      transform: skewX(15deg);
    }
  `;

  static override properties = {
    hero: { type: Object },
    unlocks: { type: Number },
    new: { type: Boolean, attribute: true, reflect: true },
  };

  hero: Hero | undefined = undefined;
  unlocks = 0;
  /** Whether the hero is marked new (it has main menu backgrounds). Computed from `hero.background`. */
  new = false;

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("hero")) {
      this.new = this.hero?.background ?? false;
    }
  }

  override render() {
    const hero = this.hero;
    const unlockable = Math.max(hero?.unlockable ?? 1, 1);
    const unlocked = Math.min(Math.max(this.unlocks, 0), unlockable);
    const portrait = hero ? `background-image: url(${heroPortrait(hero.id)})` : "";
    const completion = `width: ${(unlocked / unlockable) * 100}%; background: ${hero?.color ?? "white"}`;
    return html`
      <div class="portrait" style=${portrait}></div>
      <div class="new">
        new!
        <div class="flare" @animationiteration=${this.rotateFlare}></div>
      </div>
      <div class="glow"></div>
      <div class="content">
        <div class="name">${hero?.name ?? "Unknown"}</div>
        <div class="progress">
          <div class="completion" style=${completion}></div>
          <span class="unlocked">${unlocked}/${unlockable}</span>
        </div>
      </div>
    `;
  }

  /** Gives the flare a random rotation every time its shine animation restarts. */
  private rotateFlare(event: AnimationEvent) {
    const flare = event.currentTarget as HTMLElement;
    flare.style.transform = `translate(-50%, -50%) rotate(${Math.floor(Math.random() * 360)}deg)`;
  }
}
