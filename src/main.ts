// Application entry point. Loads the document styles, starts the router and
// registers the application shell element.
import "./styles/global.css";
import { installRouter } from "./lib/router.js";
import "./elements/overwebs-app.js";

installRouter();
