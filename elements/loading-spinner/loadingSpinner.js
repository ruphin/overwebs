import { html, css, LitElement } from "lit";

export default class OverwebsLoadingSpinner extends LitElement {
  static properties = {
    size: { type: Number },
  };

  constructor() {
    super();
    this.size = 52;
  }

  firstUpdated() {
    this._svg = this.shadowRoot.querySelector("svg");
  }

  updated() {
    this._svg.style.width = `calc(${this.size} / 25.6 * 1vw)`;
    this._svg.style.height = `calc(${this.size} / 25.6 * 1vw)`;
  }

  static styles = css`
    @keyframes animate-spinner {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      10% {
        opacity: 0;
        transform: scale(0.5);
      }
      50% {
        opacity: 0;
        transform: scale(0.5);
      }
      60% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    :host {
      display: inline-block;
    }
    :host[white] #one,
    :host[white] #two,
    :host[white] #three,
    :host[white] #four,
    :host[white] #five,
    :host[white] #six,
    :host[white] #seven {
      fill: #ffffff;
    }
    :host #one,
    :host #two,
    :host #three,
    :host #four,
    :host #five,
    :host #six,
    :host #seven {
      animation-duration: 2.1s;
      animation-name: animate-spinner;
      animation-iteration-count: infinite;
      background: #ffffff;
    }
    :host #one {
      animation-delay: 0s;
    }
    :host #two {
      animation-delay: 0.15s;
    }
    :host #three {
      animation-delay: 0.3s;
    }
    :host #four {
      animation-delay: 0.45s;
    }
    :host #five {
      animation-delay: 0.6s;
    }
    :host #six {
      animation-delay: 0.75s;
    }
    :host #seven {
      animation-delay: 0.9s;
    }
  `;

  render() {
    return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576">
      <g transform="translate(189.5 119)">
        <path
          id="one"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(386.5 119)">
        <path
          id="two"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(485 288)">
        <path
          id="three"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(386.5 457)">
        <path
          id="four"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(189.5 457)">
        <path
          id="five"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(91 288)">
        <path
          id="six"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
      <g transform="translate(288 288)">
        <path
          id="seven"
          d="M-14.5 -95.6215
      a29 29 0 0 1 29 0
      l61.066641993582 35.256842193501
      a29 29 0 0 1 14.5 25.114736709749
      l0 70.513684387002
      a29 29 0 0 1 -14.5 25.114736709749
      l-61.066641993582 35.256842193501
      a29 29 0 0 1 -29 0
      l-61.066641993582 -35.256842193501
      a29 29 0 0 1 -14.5 -25.114736709749
      l1.1230431185007e-13 -70.513684387002
      a29 29 0 0 1 14.5 -25.114736709749"
        ></path>
      </g>
    </svg>`;
  }
}
