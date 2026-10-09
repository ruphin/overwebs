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
    }

    .main-menu {
      margin-top: calc(415.168 * var(--u));
      gap: calc(9.408 * var(--u));

      a {
        padding-left: calc(64.448 * var(--u));
        color: white;
        -webkit-text-stroke: calc(4.544 * var(--u)) rgba(0, 0, 0, 0.15);
        font-family: var(--font-display);
        font-size: calc(100.8 * var(--u));
        line-height: 1;

        &:not([aria-disabled]):hover {
          padding-left: calc(133.184 * var(--u));
          transform: scale(1.1);
        }
      }
    }

    .sub-menu {
      align-items: flex-start;
      margin-top: calc(11.84 * var(--u));
      gap: calc(13.12 * var(--u));

      a {
        padding-left: calc(66.112 * var(--u));
        color: rgba(255, 255, 255, 0.95);
        -webkit-text-stroke: calc(3.008 * var(--u)) rgba(154, 166, 195, 0.8);
        font-family: var(--font-ui);
        font-size: calc(37.248 * var(--u));
        text-transform: uppercase;
        white-space: nowrap;

        &:not([aria-disabled]):hover {
          padding-left: calc(82.624 * var(--u));
          transform: scale(1.1);
        }
      }
    }

    a[aria-disabled] {
      color: rgba(255, 255, 255, 0.6);
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
      >${item.label}</a
    >`;
  }
}
