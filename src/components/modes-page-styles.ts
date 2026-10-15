import { css } from "@gluon/gluon";

/**
 * The layout shared by the play, training and vs-ai pages: the page title top
 * left, a centred row of play tiles that fade in one after another, and the
 * player widget and back button in the corners.
 */
export const modesPageStyles = css`
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    width: 100vw;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.25);
  }

  a {
    text-decoration: none;
  }

  overwebs-page-title {
    position: absolute;
    top: calc(184 * var(--u));
    left: calc(120 * var(--u));
  }

  .modes {
    margin-top: calc(378 * var(--u));
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: calc(16 * var(--u));

    > * {
      animation: fadein 0.2s linear both;

      &:nth-child(2) {
        animation-delay: 0.05s;
      }
      &:nth-child(3) {
        animation-delay: 0.1s;
      }
      &:nth-child(4) {
        animation-delay: 0.15s;
      }
      &:nth-child(5) {
        animation-delay: 0.2s;
      }

      &:hover {
        z-index: 2;
      }
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
   * Portrait: the title under the top bar, the tiles in a grid of as many
   * columns as fit (two on phones and tablets), scrolling under the bottom bar.
   */
  @media (orientation: portrait) {
    overwebs-page-title {
      top: var(--top-bar);
      left: var(--page-gutter);
    }

    /*
     * The region clips at the title and the bottom bar; its padding leaves
     * room for a pressed tile, which grows by 5% a side plus its shadow.
     */
    .modes {
      position: absolute;
      inset: calc(var(--top-bar) + 150 * var(--u)) 0 var(--bottom-bar);
      box-sizing: border-box;
      margin: 0;
      padding: calc(48 * var(--u)) var(--page-gutter);
      column-gap: calc(8 * var(--u));
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, calc(417 * var(--u)));
      justify-content: center;
      align-content: start;
    }
  }
`;
