// Pure public entrypoint: classes, helpers and types only. Nothing in here
// (or in anything it imports) may have side effects such as
// customElements.define(), so bundlers can tree-shake unused exports.
// Registering entrypoints live in src/elements/.
export { Store, type Listener } from "./lib/store.js";
export {
  settings,
  updateSettings,
  loadSettings,
  prefersLowBandwidth,
  type Settings,
} from "./lib/settings.js";
export {
  ChatEmitter,
  LocalChatHandler,
  type ChatHandler,
  type ChatListener,
  type ChatMessage,
} from "./lib/chat.js";
export { ApiChatHandler, DEFAULT_CHAT_URL, type ApiChatOptions } from "./lib/chat-api.js";
export { heroes, heroById, heroPortrait, type Hero } from "./lib/heroes.js";
export {
  player,
  defaultPlayer,
  avatarUrl,
  displayLevel,
  prestigeStars,
  prestigeRank,
  type Player,
  type PlayerStatus,
  type PrestigeRank,
} from "./lib/player.js";
export {
  session,
  login,
  logout,
  restoreSession,
  userIdFor,
  displayName,
  type LoginRequest,
} from "./lib/session.js";
export {
  queueState,
  startQueue,
  stopQueue,
  formatElapsed,
  type QueueState,
} from "./lib/game-state.js";
export { keybindings, bindKey, installKeybindings, type Keybinding } from "./lib/keybindings.js";
export {
  backgroundSets,
  buildBackgroundSet,
  selectBackgrounds,
  transitionFor,
  LOGIN_BACKGROUND,
  type Background,
  type BackgroundSet,
  type BackgroundSelection,
} from "./lib/backgrounds.js";
export { route, navigate, back, installRouter, type Route } from "./lib/router.js";
export { pages, type Page } from "./lib/pages.js";

// Components (pure classes; register them through src/elements/)
export { OverwebsButton, type ButtonVariant } from "./components/overwebs-button.js";
export { OverwebsLoadingSpinner } from "./components/overwebs-loading-spinner.js";
export { OverwebsNotification } from "./components/overwebs-notification.js";
export { OverwebsPlayerWidget } from "./components/overwebs-player-widget.js";
export { OverwebsGlobalButton } from "./components/overwebs-global-button.js";
export { OverwebsPageTitle } from "./components/overwebs-page-title.js";
export { OverwebsMainMenu, type MenuItem } from "./components/overwebs-main-menu.js";
export {
  OverwebsPlayTile,
  playTileImages,
  playTileImage,
  playTileIcon,
  type PlayMode,
} from "./components/overwebs-play-tile.js";
export {
  OverwebsArcadeTile,
  arcadeTileImages,
  arcadeTileImage,
  MAX_POPULARITY,
  type ArcadeMode,
} from "./components/overwebs-arcade-tile.js";
export { OverwebsGalleryHero } from "./components/overwebs-gallery-hero.js";
export { OverwebsBackground } from "./components/overwebs-background.js";
export { OverwebsChatWidget } from "./components/overwebs-chat-widget.js";
export { OverwebsLoginPage } from "./components/overwebs-login-page.js";
export { OverwebsMainPage } from "./components/overwebs-main-page.js";
export { OverwebsPlayPage, type QueueRequest } from "./components/overwebs-play-page.js";
export { OverwebsTrainingPage } from "./components/overwebs-training-page.js";
export { OverwebsOptionsPage } from "./components/overwebs-options-page.js";
export { OverwebsVsAiPage } from "./components/overwebs-vs-ai-page.js";
export { OverwebsArcadePage } from "./components/overwebs-arcade-page.js";
export { OverwebsCompetitivePage } from "./components/overwebs-competitive-page.js";
export { OverwebsGalleryPage } from "./components/overwebs-gallery-page.js";
export { OverwebsApp } from "./components/overwebs-app.js";
