// Application entry point. Loads the document styles, starts the router and
// registers the application shell element.
import "./styles/global.css";
import { installRouter } from "./lib/router.js";
import "./elements/overwebs-app.js";

installRouter();

// iOS Safari applies `:active` to a touched element only when the page listens
// for touch events. The touch press effects (see `@media (hover: none)` in the
// components) depend on it.
document.addEventListener("touchstart", () => {}, { passive: true });
