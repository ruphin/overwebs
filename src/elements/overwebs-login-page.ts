import { define } from "@gluon/gluon";
import { OverwebsLoginPage } from "../components/overwebs-login-page.js";
import "./overwebs-button.js";
export { OverwebsLoginPage };
define(OverwebsLoginPage, "overwebs-login-page");
declare global {
  interface HTMLElementTagNameMap {
    "overwebs-login-page": OverwebsLoginPage;
  }
}
