import { html, css, LitElement } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";

import OverwebsMainPage from "@overwebs/main-page";
import OverwebsPlayPage from "@overwebs/play-page";
import OverwebsLoginPage from "@overwebs/login-page";
import OverwebsBackground from "@overwebs/background";

import {
  navigate,
  interceptNavigation,
  router,
  ROUTE_CHANGED,
} from "@ruphin/spa-router";

interceptNavigation();

export default class OverwebsApp extends ScopedElementsMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      position: relative;
      background: black;
    }
    #chat[hidden] {
      display: none;
    }
    #pages > *:not([visible]) {
      display: none;
    }
    #exit {
      position: relative;
      height: 100vh;
      width: 100vw;
      background: black;
    }
  `;

  static get scopedElements() {
    return {
      "overwebs-login-page": OverwebsLoginPage,
      "overwebs-main-page": OverwebsMainPage,
      "overwebs-background": OverwebsBackground,
      "overwebs-play-page": OverwebsPlayPage,
    };
  }

  firstUpdated() {
    const pages = Object.fromEntries(
      Array.from(this.renderRoot.querySelectorAll("[route]")).map((node) => [
        node.getAttribute("route"),
        node,
      ])
    );
    const background = this.renderRoot.querySelector("overwebs-background");

    // Force the url to /login on initial load
    navigate("/login");

    /**
     * Handle changes in the route
     *
     * Changes the "visible" attribute to the right page element
     * Changes the `to` and `from` properties on the background
     */
    const onRouteChange = ({ routePath }) => {
      const oldPage = this.renderRoot.querySelector("[visible]");
      const oldRoute = oldPage?.getAttribute("route");
      console.log("OLD", oldRoute, oldPage);
      const newRoute = routePath.slice(1);
      const newPage = pages[newRoute];
      console.log("NEW", newRoute, newPage);
      if (newPage) {
        if (oldPage) {
          oldPage.removeAttribute("visible");
        }
        newPage.setAttribute("visible", "");

        background.from = oldRoute;
        background.to = newRoute;
      }
    };

    // Call or route change listener when the router detects route changes
    router.addEventListener(ROUTE_CHANGED, onRouteChange);

    // Manually call the route change listener on initial load
    onRouteChange({ routePath: "/login" });
  }

  // TODO: Unlocks
  render() {
    return html`<overwebs-background id="background"></overwebs-background>

      <div id="pages">
        <a href="/" route="exit" id="exit"></a>
        <overwebs-login-page
          @login=${this.login}
          route="login"
        ></overwebs-login-page>
        <overwebs-main-page
          route="main"
          .hero="${this.hero}"
        ></overwebs-main-page>
        <overwebs-gallery-page route="gallery"></overwebs-gallery-page>
        <overwebs-play-page route="play"></overwebs-play-page>
        <overwebs-competitive-page
          route="competitive"
        ></overwebs-competitive-page>
        <overwebs-arcade-page route="arcade"></overwebs-arcade-page>
        <overwebs-training-page route="training"></overwebs-training-page>
        <overwebs-vs-ai-page route="vs-ai"></overwebs-vs-ai-page>
      </div>

      <!-- <overwebs-notification id="notification" spinner hidden>
        <div slot="title" id="notification-title"></div>
        <div slot="message" id="notification-message"></div>
        <div slot="button" id="notification-button"></div>
      </overwebs-notification> -->

      <!-- <overwebs-queue-manager id="queue-manager"></overwebs-queue-manager> -->

      <!-- <overwebs-chat-widget
        id="chat"
        tabindex="-1"
        firebase="[[firebase]]"
        player-data="[[playerData]]"
      ></overwebs-chat-widget> --> `;
  }

  login() {
    navigate("/main");
  }
}

// Polymer({
//   is: 'overwebs-app',

//   properties: {
//     route: {
//       type: Object,
//       reflectToAttribute: true,
//       observer: '_routeChanged'
//     },
//     _routes: {
//       type: Object,
//       value: {}
//     }
//   },

//   ready: function() {
//     // At initial boot, redirect to loading screen
//     window.history.replaceState({}, null, '/loading');
//     window.dispatchEvent(new CustomEvent('location-changed'));

//     Array.prototype.map.call(this.$.pages.children, (page) => {
//       this._routes[page.getAttribute("route")] = page;
//     });
//     let mobile = false;
//     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))mobile = true})(navigator.userAgent||navigator.vendor||window.opera);
//     if (mobile) {
//       this.$.background.lowBandwidth = true;
//     }

//     // Check if this user has previously logged in by checking firebaseID in the cookie.
//     let userID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
//     if (userID) {
//       // This user already has a login. Signin with this existing login.
//       let password = userID + "000000".slice(userID.length);
//       this.firebase.auth().signInWithEmailAndPassword(`${userID}@ruph.in`, password)
//       .then((e) => {
//         this.$.playerdata.login = { userID: userID, uid: e.uid };
//         this.loggedIn = true;
//         window.history.replaceState({}, null, '/main');
//         window.dispatchEvent(new CustomEvent('location-changed'));
//       }).catch((e) => { console.log(e); }); // Log error
//     } else {
//       // Redirect to login page
//       window.history.replaceState({}, null, '/login');
//       window.dispatchEvent(new CustomEvent('location-changed'));
//     }

//     this.addEventListener('login', (e) => this._login(e), true);

//     this.addEventListener('notification', (e) => this._notification(e), true);

//     this.addEventListener('queue', (e) => this._queue(e.detail.queueType), true);
//   },

//   _queue: function(queueType) {
//     console.log(this.$['queue-manager'])
//     this.$['queue-manager'].queue(queueType);
//   },

//   _notification: function(e) {
//     this.$.notification.removeAttribute('hidden')
//     console.log(e.detail)
//     if (e.detail['title']) {
//       Polymer.dom(this.$['notification-title']).appendChild(e.detail['title'])
//     }
//     if (e.detail['message']) {
//       Polymer.dom(this.$['notification-message']).appendChild(e.detail['message'])
//     }
//     if (e.detail['button']) {
//       Polymer.dom(this.$['notification-button']).appendChild(e.detail['button'])
//     }
//   },

//   _login: function(e) {
//     e.preventDefault();

//     let userID;
//     if (e.detail.anonymous) {
//       // Append some random alphanumerics for anonymous ID
//       userID = `Anonymous-${Math.random().toString(36).slice(2,-20)}`;
//     } else if (e.detail.battleTag) {
//       userID = `${e.detail.username}-${e.detail.battleTag}`;
//     } else {
//       userID = `${e.detail.username}`;
//     }

//     // Pad the password with 0s
//     let password = userID + "000000".slice(userID.length);

//     this.firebase.auth().createUserWithEmailAndPassword(`${userID}@ruph.in`, password)
//     .then((e) => {
//       // If a new user is created, push the userID
//       // onto the database message list so we know who's who
//       this.firebase.database().ref(`messages/${e.uid}`).push(userID);
//       return e
//     }).catch((e) => {
//       // If the user already logged in before, just log in directly
//       if (e.code == "auth/email-already-in-use") {
//         return this.firebase.auth().signInWithEmailAndPassword(`${userID}@ruph.in`, password)
//       }
//     }).then((e) => {
//       e.updateProfile({ displayName: userID }).catch((e) => {
//         console.warn("Failed to add DisplayName")
//       });
//       document.cookie = `userID=${userID}`
//       this.$.playerdata.login = { userID: userID, uid: e.uid };
//       this.loggedIn = true;
//       window.history.replaceState({}, null, '/main');
//       window.dispatchEvent(new CustomEvent('location-changed'));
//     });
//   },

//   _routeChanged: function(newRoute, oldRoute) {
//     // Some browsers call `_routeChanged` before `ready`.
//     // If this happens, `this._routes` is still empty.
//     // In that case, simply defer the call to `_routeChanged`.
//     if (Object.keys(this._routes).length === 0) {
//       setTimeout(() => { this._routeChanged(newRoute, oldRoute) }, 0);
//       return;
//     }

//     // I'm not sure if this belongs here. Maybe I need to extract the logic for this somehow and expose an API
//     if (newRoute.__queryParams && newRoute.__queryParams.background) {
//       this.$.backgroundData.select = newRoute.__queryParams.background;
//       window.history.replaceState({}, null, '/main');
//       window.dispatchEvent(new CustomEvent('location-changed'));
//     }

//     // Remove initial '/' in the route path
//     oldRoute = oldRoute && oldRoute.path.slice(1)
//     newRoute = newRoute && newRoute.path.slice(1)

//     // Wait for the login to resolve
//     if (!this.loggedIn && newRoute != 'login') {
//       // Show the loading background? Maybe this needs to be done elsewhere
//       this.$.background.page = 'login'
//       return
//     }

//     // Hide the old page
//     if (this._routes[oldRoute]) {
//       this._routes[oldRoute].classList.remove("visible")
//     }

//     // Show the new page
//     if (this._routes[newRoute]) {
//       this._routes[newRoute].classList.add("visible")
//     } else {
//       // Go back if the new page does not exist (and the old page does)
//       if (this._routes[oldRoute]) {
//         console.warn("Requested page does not exist");
//         window.history.back();
//       }
//       return;
//     }

//     // Enable or disable or move the chat widget depending on the page.
//     // Should this be responsibility of the app? I don't know.
//     if (newRoute === 'login') {
//       this.$.chat.setAttribute('hidden', '');
//     } else {
//       this.$.chat.removeAttribute('hidden');
//     }

//     // Notify the background element that we changed route
//     this.$.background.page = newRoute

//     // Lazy load any new pages we are visiting that haven't been loaded yet
//     if (newRoute != 'main' && this._routes[newRoute] && newRoute != 'exit') {
//       let newRouteElement = this._routes[newRoute].tagName.toLowerCase()
//       newPage = this.resolveUrl('../' + newRouteElement + '/' + newRouteElement + '.html')
//       this.importHref(newPage, null, function() {
//         console.warn("Cannot load new page");
//         window.history.back();
//       }, true);
//     }
//   },
// });
