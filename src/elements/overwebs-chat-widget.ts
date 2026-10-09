import { define } from "@gluon/gluon";
import { OverwebsChatWidget } from "../components/overwebs-chat-widget.js";

export { OverwebsChatWidget };
define(OverwebsChatWidget, "overwebs-chat-widget");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-chat-widget": OverwebsChatWidget;
  }
}
