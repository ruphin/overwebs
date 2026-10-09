import { define } from "@gluon/gluon";
import { OverwebsApp } from "../components/overwebs-app.js";
import "./overwebs-background.js";
import "./overwebs-chat-widget.js";
import "./overwebs-login-page.js";
import "./overwebs-main-page.js";
import "./overwebs-notification.js";

export { OverwebsApp };

define(OverwebsApp, "overwebs-app");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-app": OverwebsApp;
  }
}
