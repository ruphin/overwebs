import { GluonElement, css, html, ifDefined } from "@gluon/gluon";

/** An entry of the main menu. Primary items are the big links at the top. */
export interface MenuItem {
  label: string;
  href: string;
  primary?: boolean;
  disabled?: boolean;
}

/**
 * The main menu: the big primary links (Play, Training, ...) and the small
 * secondary links below them. Links are plain anchors handled by the router.
 *
 * A hovered (or, on touch screens, pressed) link slides right and a beam of
 * light shines from the left edge of the screen behind it, as in the game.
 */
export class OverwebsMainMenu extends GluonElement {
  static override styles = css`
    :host {
      display: block;
    }

    nav {
      display: contents;
    }

    .main-menu,
    .sub-menu {
      display: flex;
      flex-direction: column;
      width: calc(768 * var(--u));
    }

    a {
      position: relative;
      text-decoration: none;
      paint-order: stroke fill;

      &:focus {
        outline: none;
      }

      /*
       * The beam, measured from the game: it appears in one frame at its full
       * length and vanishes in one frame. Its white core flashes, dims to about
       * 60% over 0.4s, holds, and swells back to full by 1.8s, while a
       * blue-violet halo stays constant and shows through the dip.
       *
       * Shape (design px, from a 1920 screenshot): a solid white band 72 tall
       * at the edge of the screen that runs through most of the label and is
       * gone at its end, tapering into a line about 25 tall that ends at 640.
       * The halo is 110 tall at the edge, about 85 along the band, and
       * collapses just past the label into a thin tail that ends at 800.
       *
       * Three boxes: the halo wedge (::before) and the white band (.beam) are
       * as long as the link, so they fit its label; the tail (::after) has a
       * fixed length, so its tip is at the same point for every link.
       */
      &::before,
      &::after,
      .beam {
        position: absolute;
        z-index: -1;
        left: 0;
        top: 50%;
        height: var(--beam-height);
        translate: 0 -50%;
        opacity: 0;
        pointer-events: none;
      }

      &::before,
      &::after {
        content: "";
      }

      /* The halo wedge: a little longer than the label, but never past the tail. */
      &::before {
        width: min(calc(100% + 0.18 * var(--beam-width)), calc(0.97 * var(--beam-width)));
        background: radial-gradient(
          ellipse 100% 53% at 0 50%,
          rgba(225, 225, 255, 0.85) 0 72%,
          rgba(225, 225, 255, 0)
        );
      }

      /* The white band, with the flare at the screen edge. Pulses. */
      .beam {
        width: 100%;
        background:
          radial-gradient(
            ellipse 100% 30% at 0 50%,
            #fff 0 70%,
            rgba(255, 255, 255, 0.85) 82%,
            rgba(255, 255, 255, 0)
          ),
          radial-gradient(
            ellipse calc(50 * var(--u)) 46% at 0 50%,
            #fff 0 60%,
            rgba(255, 255, 255, 0.85) 75%,
            rgba(255, 255, 255, 0)
          );
      }

      /* The tail: the thin line with its sparkles, and the halo's thin band. Pulses. */
      &::after {
        width: var(--beam-width);
        mask-image: linear-gradient(to right, #000 0, #000 85%, transparent 100%);
        background:
          radial-gradient(circle at 46% 44%, #fff 0, rgba(255, 255, 255, 0) calc(3 * var(--u))),
          radial-gradient(circle at 61% 56%, #fff 0, rgba(255, 255, 255, 0) calc(2.5 * var(--u))),
          radial-gradient(circle at 74% 47%, #fff 0, rgba(255, 255, 255, 0) calc(2 * var(--u))),
          radial-gradient(
            ellipse 84% 12.5% at 0 50%,
            #fff 0 72%,
            rgba(255, 255, 255, 0.6) 88%,
            rgba(255, 255, 255, 0)
          ),
          linear-gradient(
            to bottom,
            rgba(225, 225, 255, 0) 40%,
            rgba(225, 225, 255, 0.6) 50%,
            rgba(225, 225, 255, 0) 60%
          );
      }
    }

    /* The core's slow breathing once it has settled. */
    @keyframes beam-breathe {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.9;
      }
    }

    /* The core's flash, dip and swell after the beam appears. */
    @keyframes beam-pulse {
      0% {
        opacity: 1;
      }
      22% {
        opacity: 0.6;
      }
      42% {
        opacity: 0.6;
      }
      100% {
        opacity: 1;
      }
    }

    .main-menu {
      margin-top: calc(415.168 * var(--u));
      gap: calc(9.408 * var(--u));
      /* Links are as wide as their label, so the beam can fit it. */
      align-items: flex-start;

      a {
        --beam-width: calc(820 * var(--u));
        --beam-height: calc(120 * var(--u));
        padding-left: calc(64.448 * var(--u));
        white-space: nowrap;
        /* The centre of the column, where the scale was centred when the links spanned it. */
        transform-origin: calc(384 * var(--u)) 50%;
        color: white;
        -webkit-text-stroke: calc(4.544 * var(--u)) rgba(0, 0, 0, 0.15);
        font-family: var(--font-display);
        font-size: calc(100.8 * var(--u));
        line-height: 1;

        @media (hover: hover) {
          &:not([aria-disabled]):hover {
            padding-left: calc(133.184 * var(--u));
            transform: scale(1.1);

            &::before {
              opacity: 1;
            }

            &::after,
            .beam {
              opacity: 1;
              animation:
                beam-pulse 1.8s ease-in-out both,
                beam-breathe 2.6s ease-in-out 1.8s infinite;
            }
          }
        }

        /* Touch screens: the same while the link is pressed. */
        @media (hover: none) {
          &:not([aria-disabled]):active {
            padding-left: calc(133.184 * var(--u));
            transform: scale(1.1);

            &::before {
              opacity: 1;
            }

            &::after,
            .beam {
              opacity: 1;
              animation:
                beam-pulse 1.8s ease-in-out both,
                beam-breathe 2.6s ease-in-out 1.8s infinite;
            }
          }
        }
      }
    }

    .sub-menu {
      align-items: flex-start;
      margin-top: calc(11.84 * var(--u));
      gap: calc(13.12 * var(--u));

      a {
        --beam-width: calc(520 * var(--u));
        --beam-height: calc(56 * var(--u));
        padding-left: calc(66.112 * var(--u));
        color: rgba(255, 255, 255, 0.95);
        -webkit-text-stroke: calc(3.008 * var(--u)) rgba(154, 166, 195, 0.8);
        font-family: var(--font-ui);
        font-size: calc(37.248 * var(--u));
        text-transform: uppercase;
        white-space: nowrap;

        @media (hover: hover) {
          &:not([aria-disabled]):hover {
            padding-left: calc(82.624 * var(--u));
            transform: scale(1.1);

            &::before {
              opacity: 1;
            }

            &::after,
            .beam {
              opacity: 1;
              animation:
                beam-pulse 1.8s ease-in-out both,
                beam-breathe 2.6s ease-in-out 1.8s infinite;
            }
          }
        }

        @media (hover: none) {
          &:not([aria-disabled]):active {
            padding-left: calc(82.624 * var(--u));
            transform: scale(1.1);

            &::before {
              opacity: 1;
            }

            &::after,
            .beam {
              opacity: 1;
              animation:
                beam-pulse 1.8s ease-in-out both,
                beam-breathe 2.6s ease-in-out 1.8s infinite;
            }
          }
        }
      }
    }

    a[aria-disabled] {
      color: rgba(255, 255, 255, 0.6);
    }

    /* Portrait: the page positions the menu; its links are big enough to tap. */
    @media (orientation: portrait) {
      .main-menu {
        margin-top: 0;
      }

      .sub-menu a {
        font-size: max(calc(37.248 * var(--u)), 16px);
        padding-block: calc(4 * var(--u));
      }
    }
  `;

  static override properties = {
    items: { type: Array },
  };

  items: MenuItem[] = [];

  override render() {
    const primary = this.items.filter((item) => item.primary);
    const secondary = this.items.filter((item) => !item.primary);
    return html`
      <nav>
        <div class="main-menu">${primary.map((item) => this.renderItem(item))}</div>
        <div class="sub-menu">${secondary.map((item) => this.renderItem(item))}</div>
      </nav>
    `;
  }

  private renderItem(item: MenuItem) {
    return html`<a
      href=${ifDefined(item.disabled ? undefined : item.href)}
      aria-disabled=${ifDefined(item.disabled ? "true" : undefined)}
      ><span class="beam" aria-hidden="true"></span>${item.label}</a
    >`;
  }
}
