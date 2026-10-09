import { define } from "@gluon/gluon";
import { OverwebsNotification } from "../components/overwebs-notification.js";
import "./overwebs-button.js";
import "./overwebs-loading-spinner.js";

export { OverwebsNotification };

define(OverwebsNotification, "overwebs-notification");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-notification": OverwebsNotification;
  }
}
