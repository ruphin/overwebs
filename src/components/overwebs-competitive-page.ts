import { GluonElement, css, html, svg } from "@gluon/gluon";
import { back } from "../lib/router.js";

/** The competitive play emblem (`/images/competitive.svg`), viewBox `0 0 313 273`. */
const competitiveEmblem = svg`
  <path fill-rule="evenodd" clip-rule="evenodd" d="M165.43,64.436v55.75l28.278-27.396c0,0,0.119-12.263,2.834-14.979l27-28V5.437L165.43,64.436z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M156.557,258.89l42.085-41.031c2.737-2.737,2.811-3.574,0.066-6.318s-13.865-14.147-15.844-16.126s-1.974-2.229-4.736,0.534s-10.3,10.507-14.48,14.687s-8.091,3.782-8.091,3.782L156.557,258.89z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M228.688,225.874c-8.958-9.656-47.661-47.375-48.021-47.375s-18.627,19.357-18.627,19.357c-1.815,1.762-3.613,1.366-5.593,1.362v-16.906c2.841,0.021,3.718-1.269,5.142-3.708c1.266-2.167,1.641-3.375,1.641-6.668s0-18.464,0-22.493c0-6.425-1.103-5.965,3.447-10.515l96.99-98.751c1.204-1.164,2.33-2.038,4.174-2.028l42.956-0.009c0,0-76.39,77.851-77.442,79.652s0.312,5.167-0.021,6.75c0.292,1.625-16.403,17.991-21.117,22.705s-4.06,9.194,1.513,15.066c4.818,5.076,9.722,10.381,14.688,15.313c1.537,1.526,1.098,3.312,1.09,5.503c-0.048,12.75,0,38.25,0,38.25l0.014,4.497H228.688z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M242.859,174.982l43.061-43.744c2.565-2.565,2.433-5.445,2.433-9.286s0-26.31,0-29.248s-0.721-3.724-4.518,0.073s-56.5,56.345-57.75,57.596s-3.333,3.958-0.708,6.583L242.859,174.982z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M147.736,64.436v55.75L119.458,92.79c0,0-0.119-12.263-2.834-14.979l-27-28V5.437L147.736,64.436z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M156.609,258.89l-42.085-41.031c-2.737-2.737-2.811-3.574-0.066-6.318s13.865-14.147,15.844-16.126s1.974-2.229,4.736,0.534s10.3,10.507,14.48,14.687s8.091,3.782,8.091,3.782L156.609,258.89z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M84.479,225.874c8.958-9.656,47.661-47.375,48.021-47.375s18.627,19.357,18.627,19.357c1.815,1.762,3.613,1.366,5.593,1.362v-16.906c-2.841,0.021-3.718-1.269-5.142-3.708c-1.266-2.167-1.641-3.375-1.641-6.668s0-18.464,0-22.493c0-6.425,1.103-5.965-3.447-10.515l-96.99-98.751c-1.204-1.164-2.33-2.038-4.174-2.028L2.37,38.138c0,0,76.39,77.851,77.442,79.652s-0.312,5.167,0.021,6.75c-0.292,1.625,16.403,17.991,21.117,22.705s4.06,9.194-1.513,15.066c-4.818,5.076-9.722,10.381-14.688,15.313c-1.537,1.526-1.098,3.312-1.09,5.503c0.048,12.75,0,38.25,0,38.25l-0.014,4.497H84.479z" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="M70.307,174.982l-43.061-43.744c-2.565-2.565-2.433-5.445-2.433-9.286s0-26.31,0-29.248s0.721-3.724,4.518,0.073s56.5,56.345,57.75,57.596s3.333,3.958,0.708,6.583L70.307,174.982z" />
`;

/** The info icon (`/images/info.svg`), viewBox `0 0 146.5 146.5`. */
const infoIconPath = svg`
  <path d="M73.25,0C32.79,0,0,32.8,0,73.25c0,40.45,32.79,73.25,73.25,73.25c40.45,0,73.25-32.8,73.25-73.25C146.5,32.8,113.7,0,73.25,0z M80.44,116.2h-14.5V58.94h14.5V116.2z M73.247,43.876c-5.646,0-10.224-4.577-10.224-10.224s4.577-10.224,10.224-10.224s10.224,4.577,10.224,10.224S78.894,43.876,73.247,43.876z" />
`;

const infoIcon = () =>
  html`<svg class="i" viewBox="0 0 146.5 146.5" aria-hidden="true">${infoIconPath}</svg>`;

/** The titled lists in the info box. */
const infoSections: readonly { readonly title: string; readonly items: readonly string[] }[] = [
  {
    title: "Skill rating",
    items: [
      "10 Placement matches",
      "Skill rating determined (1-5000)",
      "Skill rating adjusts after each win or loss",
    ],
  },
  {
    title: "Competitive Matches",
    items: ["Matches last multiple rounds", "Earn points by taking objectives", "Most points win!"],
  },
  {
    title: "Seasons",
    items: [
      "New season every 3 months",
      "Earn exclusive rewards",
      "Placement starts again each season",
    ],
  },
];

/** The competitive play page: season info, rules and the (inert) buttons. */
export class OverwebsCompetitivePage extends GluonElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.25);
    }

    .emblem {
      position: absolute;
      top: calc(-50 * var(--u));
      left: calc(500 * var(--u));
      width: calc(600 * var(--u));
      height: calc(600 * var(--u));
      fill: rgba(250, 250, 250, 0.2);
    }

    .container {
      position: relative;
      display: flex;
      height: calc(800 * var(--u));
      margin-top: calc(320 * var(--u));
      margin-left: calc(320 * var(--u));
    }

    #return {
      flex-shrink: 0;
      width: calc(113 * var(--u));
      background: rgba(255, 255, 255, 0.2);

      &:hover {
        box-shadow: inset 0 0 0 calc(3 * var(--u)) #ffffff;
      }
    }

    .competitive {
      margin-left: calc(35 * var(--u));
      flex-grow: 1;
      color: white;

      .header {
        position: relative;
        font-family: var(--font-display);
        font-size: calc(84 * var(--u));
        margin-bottom: calc(36 * var(--u));

        &::after {
          content: "";
          display: block;
          position: absolute;
          bottom: calc(-22 * var(--u));
          left: 0;
          width: calc(67 * var(--u));
          height: calc(7 * var(--u));
          background: #ffffff;
        }
      }

      .text {
        max-width: calc(510 * var(--u));
        font-family: var(--font-ui);
        font-size: calc(21 * var(--u));
        text-transform: uppercase;
        color: rgba(210, 210, 210, 0.9);
        line-height: 1.4;
        margin-bottom: calc(54 * var(--u));
      }

      .title {
        margin-top: calc(71 * var(--u));
        font-family: var(--font-ui);
        font-size: calc(42 * var(--u));
        text-transform: uppercase;
        margin-bottom: calc(37 * var(--u));
      }

      .subtitle {
        font-family: var(--font-ui);
        font-size: calc(30 * var(--u));
        text-transform: uppercase;
        margin-bottom: calc(4 * var(--u));
      }
    }

    .info {
      width: calc(655 * var(--u));
      margin-right: calc(215 * var(--u));
      display: flex;
      flex-flow: column;

      .header {
        display: flex;
        align-items: center;
        font-family: var(--font-ui);
        font-size: calc(52 * var(--u));
        text-transform: uppercase;
        margin-bottom: calc(30 * var(--u));
        color: #ffffff;

        .i {
          height: calc(46 * var(--u));
          width: calc(46 * var(--u));
          display: inline-flex;
          fill: #ffffff;
          margin-right: calc(20 * var(--u));
        }
      }

      .infobox {
        flex-grow: 1;
        min-height: 0;
        margin-left: calc(22 * var(--u));
        padding-left: calc(57 * var(--u));
        box-shadow: inset calc(4 * var(--u)) 0 0 0 rgba(255, 255, 255, 0.25);
        display: flex;
        flex-flow: column;
      }

      .infotext {
        position: relative;
        flex-grow: 1;
        color: #ffffff;
        overflow-y: scroll;

        &::-webkit-scrollbar {
          width: calc(14 * var(--u));
        }

        &::-webkit-scrollbar-track-piece {
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0,
            rgba(0, 0, 0, 0) 35%,
            rgba(0, 0, 0, 0.05) 35%,
            rgba(0, 0, 0, 0.05) 65%,
            rgba(0, 0, 0, 0) 65%,
            rgba(0, 0, 0, 0)
          );
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.5);
          border-radius: calc(64 * var(--u));
        }

        .title {
          margin-top: calc(20 * var(--u));
          margin-bottom: calc(4 * var(--u));
          font-family: var(--font-ui);
          font-size: calc(30 * var(--u));
          text-transform: uppercase;
        }

        ul {
          font-family: var(--font-text);
          list-style: none;
          padding: 0;
          margin: 0 0 calc(44 * var(--u));
          font-size: calc(22 * var(--u));
          color: rgba(255, 255, 255, 0.8);
        }

        li::before {
          content: "- ";
        }
      }

      button {
        width: 100%;
        flex-shrink: 0;
        margin-top: calc(23 * var(--u));

        &:first-of-type {
          position: relative;
          margin-top: calc(114 * var(--u));

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: calc(-46 * var(--u));
            width: 100%;
            height: calc(4 * var(--u));
            background-color: rgba(255, 255, 255, 0.25);
            pointer-events: none;
          }
        }
      }
    }

    button {
      width: calc(464 * var(--u));
      height: calc(64 * var(--u));
      padding: 0;
      border: none;
      border-radius: calc(3 * var(--u));
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: var(--font-ui);
      font-size: calc(24 * var(--u));
      text-transform: uppercase;
      color: #ffffff;
      cursor: inherit;

      .i {
        display: inline-block;
        height: calc(28 * var(--u));
        width: calc(28 * var(--u));
        fill: #ffffff;
        margin-right: calc(6 * var(--u));
      }

      &:focus {
        outline: none;
      }

      &.blue {
        background: #1c75bc;

        &:hover {
          background: rgba(36, 93, 133, 0.95);
          box-shadow: inset 0 0 0 calc(3 * var(--u)) #ffffff;
        }
      }

      &.yellow {
        background: rgba(190, 123, 40, 0.95);

        &:hover {
          background: rgba(116, 88, 46, 0.95);
          box-shadow: inset 0 0 0 calc(3 * var(--u)) #ffffff;
        }
      }

      &.big {
        height: calc(90 * var(--u));
        font-size: calc(58 * var(--u));
      }
    }
  `;

  override render() {
    return html`
      <overwebs-player-widget></overwebs-player-widget>
      <svg class="emblem" viewBox="0 0 313 273" aria-hidden="true">${competitiveEmblem}</svg>
      <div class="container">
        <div id="return" role="button" aria-label="Back" @click=${back}></div>
        <div class="competitive">
          <div class="header">Competitive Play</div>
          <div class="text">Compete against other players and work your way up the ranks.</div>
          <div class="title">Season 3</div>
          <div class="subtitle">Rewards</div>
          <div class="text">
            You can earn the following rewards at the end of the season by participating in
            competitive play:
          </div>
          <button type="button" class="blue">${infoIcon()} Rewards</button>
        </div>
        <div class="info">
          <div class="header">${infoIcon()}Info</div>
          <div class="infobox">
            <div class="infotext">
              ${infoSections.map(
                (section) => html`
                  <div class="title">${section.title}</div>
                  <ul>
                    ${section.items.map((item) => html`<li>${item}</li>`)}
                  </ul>
                `,
              )}
            </div>
            <button type="button" class="blue">${infoIcon()}Tier Legend</button>
            <button type="button" class="blue">${infoIcon()}Leaderboard</button>
            <button type="button" class="big yellow">Play</button>
          </div>
        </div>
      </div>
      <overwebs-global-button action="back" @click=${back}></overwebs-global-button>
    `;
  }
}
