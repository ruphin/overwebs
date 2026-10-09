import { define } from "@gluon/gluon";
import { OverwebsLoadingSpinner } from "../components/overwebs-loading-spinner.js";

export { OverwebsLoadingSpinner };

define(OverwebsLoadingSpinner, "overwebs-loading-spinner");

declare global {
  interface HTMLElementTagNameMap {
    "overwebs-loading-spinner": OverwebsLoadingSpinner;
  }
}
