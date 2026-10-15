# Overwebs rewrite plan: Polymer 1 → GluonJS 3

This document is the contract for the rewrite. Every component is listed with
its public API (properties, events, slots), its behaviour, and what changed
from the legacy implementation. The legacy Polymer code was removed after the
rewrite; it is in the git history before this rewrite.

## Stack

- [GluonJS 3](https://github.com/ruphin/gluonjs) (`@gluon/gluon`): `GluonElement`, `define`, `html`, `css`, reactive `static properties`. Templates are [lite-html](https://github.com/ruphin/lite-html); the available directives are `cache`, `guard`, `ifDefined`, `repeat`, `unsafeHTML`, `until`, `when`. There is **no** `classMap`/`styleMap`: build class strings and inline styles in JavaScript.
- TypeScript (strict, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`). Internal imports use `.js` extensions.
- Vite (app build, `index.html` at the root, static assets in `public/`), Vitest with happy-dom, Prettier.

## Repository layout

```
index.html              The application page
public/                 Static assets, served at /: fonts/, images/, backgrounds/, avatars/, heroes/, tiles/, arcade/
src/
  main.ts               Entry: loads global.css, installs the router, registers <overwebs-app>
  index.ts              Pure barrel: exports every component class and lib module. No side effects.
  styles/global.css     @font-face, the --u design unit, cursor, body
  lib/                  Non-component code (data, stores, router, keybindings). Done.
  components/<name>.ts  Pure component class. No customElements.define(), no top-level side effects.
  components/<name>.test.ts
  elements/<name>.ts    Registering module: imports the class, define()s it, declares HTMLElementTagNameMap,
                        and imports the elements/ modules of every custom element used in its template.
test/                   Cross-cutting tests
```

### Rules for components

1. `src/components/<name>.ts` exports `class <Name> extends GluonElement`. Pure: nothing runs at import time except class definition.
2. `src/elements/<name>.ts`:
   ```ts
   import { define } from "@gluon/gluon";
   import { OverwebsButton } from "../components/overwebs-button.js";
   import "./overwebs-loading-spinner.js"; // every custom element the template uses
   export { OverwebsButton };
   define(OverwebsButton, "overwebs-button");
   declare global {
     interface HTMLElementTagNameMap {
       "overwebs-button": OverwebsButton;
     }
   }
   ```
3. Add the class export to `src/index.ts`.
4. Tests next to the component (`<name>.test.ts`) in happy-dom. Register the class under a private tag in `beforeAll` (`customElements.define("test-<name>", Class)`), or import the element module when the test needs child elements. `await element.updateComplete` before asserting on the shadow root. happy-dom has no layout, no `::slotted`/`::part` in stylesheets, no `ElementInternals`, and does not retarget composed events; do not test those.
5. **Properties over attributes.** Data (objects, arrays, functions) is always a property, set from templates with `.prop=${value}`. Only simple styling flags may be declared with `attribute: true` (and `reflect: true` when the component styles itself through `:host([flag])`). Never read attributes to get data.
6. **Styling.** `static styles = css\`...\``. Sizes are design pixels on a 2560 wide canvas: `calc(80 * var(--u))`(the legacy`calc(80/25.6*1vw)`). Portrait screens use a narrower canvas (`--canvas`in`global.css`: 1280 on tablets, 900 on phones) and components lay themselves out differently in a `@media (orientation: portrait)`block, using the`--top-bar`, `--bottom-bar`and`--page-gutter`tokens; hover effects go behind `@media (hover: hover)`, with an `:active`twin behind`(hover: none)`so touch screens show them while pressed; key hints go behind`(hover: none)`. Fonts: `var(--font-display)`(Big Noodle),`var(--font-ui)`(Futura),`var(--font-text)`(Helvetica). Do not add`@font-face` in components; the fonts are global. Asset URLs are absolute (`/tiles/quickPlay.png`); set them from the template (`style="background-image: url(${url})"`) when they depend on a property, or in the stylesheet when fixed. Use modern CSS: logical gap instead of margin hacks, `inset`, nesting, `paint-order: stroke fill`with`-webkit-text-stroke`instead of the`::before { content: attr(...) }`outline trick,`:host(:hover)`, `@keyframes`.
7. **Events.** `new CustomEvent(name, { detail, bubbles: true, composed: true })`. Declare app-wide events in `GlobalEventHandlersEventMap` (in the component file, inside `declare global`).
8. **Lifecycle.** Subscribe to stores in `connectedCallback()` with `{ signal: this.disconnectSignal }`; call `super.connectedCallback()`. Timers are cleared on disconnect.
9. Keep the component's look as close to the legacy as possible unless the plan says otherwise. The legacy SCSS is the source of truth for sizes, colours, animations.
10. No `console.log`. Remove dead code and commented out "haxx" debugging helpers from the legacy.
11. Pages fill the viewport: `:host { display: block; width: 100vw; height: 100dvh; position: relative; overflow: hidden; }`. In portrait, the content is a scrolling container with `inset: var(--top-bar) 0 var(--bottom-bar)` (below the title where there is one), so it is clipped above the chat and the back button. Pages other than main/login have a `rgba(0,0,0,0.25)` backdrop.
12. Run `npm run check` (typecheck + prettier + tests) before finishing. Format with `npm run format`.
13. A component that renders a link or a form control (`a`, `button`, `input`, `select`, `textarea`, `label`) lists `cursorStyles` (`components/cursor-styles.ts`) first in its `styles`, so the Overwatch cursor is kept over it: the document's cursor rule does not reach into shadow roots.

## Shared library (`src/lib/`, implemented)

| Module           | Exports                                                                                                                                                                                     | Use                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `store.ts`       | `Store<T>`: `.value`, `.set()`, `.update()`, `.subscribe(listener, { signal })` (listener is called immediately and on change)                                                              | shared state                                                      |
| `heroes.ts`      | `Hero`, `heroes` (array), `heroById`, `heroPortrait(id)` → `/heroes/<id>.jpg`                                                                                                               | hero roster                                                       |
| `player.ts`      | `Player`, `player` store, `avatarUrl(id)`, `displayLevel(level)`, `prestigeStars(level)`, `prestigeRank(level)` → `"bronze" \| "silver" \| "gold"`                                          | player widget, pages                                              |
| `session.ts`     | `LoginRequest`, `session` store (user id or null), `login(request)`, `logout()`, `restoreSession()`                                                                                         | login flow (replaces Firebase auth)                               |
| `game-state.ts`  | `QueueState`, `queueState` store, `startQueue(type)`, `stopQueue()`, `formatElapsed(ms)` → `"m:ss"`                                                                                         | matchmaking queue (replaces queue manager + moment)               |
| `keybindings.ts` | `keybindings` (`back`/`apply`/`restore` → `{ key, label }`), `bindKey(key, element, { override, signal })` clicks the element when the key is pressed and it is visible                     | replaces `<overwebs-keybinding>` and `<overwebs-keybinding-data>` |
| `backgrounds.ts` | `Background`, `BackgroundSet`, `BackgroundSelection`, `selectBackgrounds(match?)`, `transitionFor(set, from, to)`, `LOGIN_BACKGROUND`                                                       | replaces `<overwebs-background-data>`                             |
| `router.ts`      | `Route { page, params }`, `route` store, `navigate(path, { replace })`, `back()`, `installRouter()` (intercepts same-origin `<a>` clicks, also inside shadow roots)                         | replaces `app-location`                                           |
| `chat.ts`        | `ChatMessage`, `ChatHandler` (`connect(signal)`, `send(author, channel, message)`, `subscribe(listener, { signal })`), `ChatEmitter`, `LocalChatHandler` (echoes the player's own messages) |
| `chat-api.ts`    | `ApiChatHandler({ url, fetch, document })`: long-polls `/api/chat/messages` on the chat server, posts sent messages, pauses while hidden                                                    |
| `settings.ts`    | `Settings { animatedBackgrounds, onlineChat }`, `settings` store (kept in `localStorage`, defaults from `prefersLowBandwidth()`), `updateSettings(changes)`, `loadSettings()`               |
| `pages.ts`       | `pages`: route → `{ tag, load() }` with dynamic imports of the page element modules                                                                                                         | lazy page loading in the app shell                                |

The legacy "data elements" (`overwebs-hero-data`, `overwebs-player-data`, `overwebs-game-state`, `overwebs-keybinding`, `overwebs-keybinding-data`, `overwebs-background-data`, `overwebs-queue-manager`, `overwebs-chat-interaction`) are **not** rewritten as elements; the lib modules above replace them.

## Components

Tag names stay `overwebs-*`. Class names are PascalCase of the tag (`OverwebsPlayTile`).

### Wave 1: leaf components

#### `overwebs-button` (legacy: `overwebs-button`)

A styled button. Renders a real `<button type="button" part="button">` with a default `<slot>` inside, so keyboard and disabled semantics are native.

- Properties: `variant: "yellow" | "blue" | "purple"` (attribute + reflect, default `"yellow"`), `disabled: boolean` (attribute + reflect; sets the inner button's disabled), `block: boolean` (attribute + reflect; `display: flex` full width).
- Styling per variant exactly as the legacy SCSS (`[yellow]`, `[blue]`, `[purple]`, `[disabled]`, `[block]`), via `:host([variant="yellow"]) button { ... }`. Host is `display: inline-flex`; the inner button has no default browser chrome (`all: unset`-style reset plus the legacy styles).
- Clicks on a disabled button must not fire `click` on the host (native disabled handles this).

#### `overwebs-loading-spinner` (legacy: `overwebs-loading-spinner`)

The seven-hexagon pulsing spinner (inline SVG from the legacy template; define the hexagon path once and reuse it with `<use>` or a `svg` template loop).

- Properties: `size: number` (design px, default 52; the SVG is `calc(size * var(--u))` square), `white: boolean` (attribute + reflect; fills hexagons white).
- Animation as legacy (`2.1s`, staggered delays of `0.15s`).

#### `overwebs-notification` (legacy: `overwebs-notification`)

The top-centre notification box used for the queue status.

- Slots: `title`, `message`.
- Properties: `spinner: boolean` (attribute + reflect; shows the spinner and divider), `action: string` (label of the button below the box; no button when empty), `hidden` (native).
- Events: `action` (`CustomEvent<void>`, bubbles, composed) when the button is clicked.
- Uses `<overwebs-loading-spinner white .size=${50}>` and `<overwebs-button variant="purple">`.

#### `overwebs-player-widget` (legacy: `overwebs-player-widget`)

The player card top right (status bar, avatar, name, level box with prestige stars).

- Properties: `player: Player | undefined`. In `connectedCallback()` it subscribes to the `player` store and sets `this.player` (tests can set `player` directly afterwards).
- Renders: status colour from `player.status` (available `#7DFF00`, away `yellow`, busy `red`), avatar from `avatarUrl(player.avatar)`, uppercase name, `displayLevel`, `prestigeStars` stars (`★`), level box class from `prestigeRank`.

#### `overwebs-global-button` (legacy: `overwebs-global-button`)

The bottom-right "[Esc] Back" style hint button.

- Properties: `action: string` (a key of `keybindings`), `label: string` (overrides the binding's label).
- Shows the key badge (`keybindings[action].key`) and the label. Binds the key with `bindKey(key, this, { signal: this.disconnectSignal })` so pressing the key clicks the host. The parent attaches `@click`.
- Re-binds when `action` changes (use an `AbortController` per binding).

#### `overwebs-page-title` (new; replaces the duplicated SVG header in play/arcade/training/vs-ai/gallery pages)

The big gradient-filled, outlined title text ("PLAY", "ARCADE", "TRAINING", "VS. AI", "HERO GALLERY").

- Properties: `text: string`.
- Renders the legacy `<svg class="header">` with the `fillgradient`/`outlinegradient` defs and `<text>` in `var(--font-display)` at `calc(266 * var(--u))`; the `headermove` entrance animation (0.6s ease-out) lives here. The host is positioned by the page.

#### `overwebs-main-menu` (legacy: `overwebs-main-menu`)

The main menu link list. Data driven instead of slotted anchors.

- Properties: `items: MenuItem[]` where `MenuItem = { label: string; href: string; primary?: boolean; disabled?: boolean }`. Primary items render in the top list (Big Noodle, big), the rest in the sub list (Futura, uppercase, small), with the legacy hover translate/scale and the text outline (`paint-order: stroke fill` + `-webkit-text-stroke`).
- Renders `<a href=${item.href}>`; the router handles the click. Disabled items render as `<a aria-disabled="true">` without href.
- Export the `MenuItem` type from the component file.

#### `overwebs-play-tile` (legacy: `overwebs-play-tile`)

The tall mode card on the play/training/vs-ai pages.

- Properties: `mode: PlayMode` where `PlayMode = "quick-play" | "arcade" | "competitive-play" | "play-vs-ai" | "custom-game" | "tutorial" | "practice-range" | "easy-ai" | "medium-ai" | "hard-ai"`; `heading: string`; `description: string`; `info: boolean` (attribute + reflect; shows the hotkey and info badges).
- Artwork: `/tiles/<image>.png` and icon `/tiles/icon-<image>.png`, mapped from the mode (`quick-play` → `quickPlay`, `arcade` → `arcade`, `competitive-play` → `competitivePlay`, `play-vs-ai` → `playVsAi`, `custom-game` → `customGame`, `tutorial` → `tutorial`, `practice-range` → `practiceRange`, `easy-ai` → `easyAI`, `medium-ai` → `mediumAI`, `hard-ai` → `hardAI`). The AI difficulty modes have no icon. `rmb.png` for the hotkey badge is at `/tiles/rmb.png`.
- Export `PlayMode` and the mode → image map.
- Hover: scale 1.1 with white outline, as legacy. Pages wrap the tile in `<a href>` when it navigates.

#### `overwebs-arcade-tile` (legacy: `overwebs-arcade-tile`)

The wide arcade mode card.

- Properties: `mode: ArcadeMode` (`"mystery-duel" | "elimination" | "mystery-heroes" | "all-brawls" | "no-limits"`), `big: boolean` (attribute + reflect), `size: string` ("1v1"), `heading: string`, `popularity: number` (0–5; 5 shows "Most Popular").
- Artwork `/arcade/<image>.png` (`mysteryDuel`, `elimination`, `mysteryHeroes`, `allBrawls`, `noLimits`); `/arcade/rmb.png`.
- The popularity bar: render five segments as elements (flex with gaps) coloured by `popularity` instead of the legacy gradient per value.

#### `overwebs-gallery-hero` (legacy: `overwebs-gallery-hero`)

The skewed hero card in the gallery.

- Properties: `hero: Hero | undefined`, `unlocks: number` (default 0).
- Portrait `heroPortrait(hero.id)` as background image; name; progress bar coloured `hero.color` with width `unlocks / unlockable`; "`<unlocked>/<unlockable>`" text; the "NEW!" badge with the flare (`/images/newFlare.png`) and glow animations when `hero.background` is true. Keep the `animationiteration` random rotation of the flare.
- Reflect `new` as an attribute for `:host([new])` styling, computed from `hero.background`.

#### `overwebs-background` (legacy: `overwebs-background`)

The fullscreen video background player. The most intricate component; preserve the legacy behaviour exactly, but structure it cleanly.

- Properties: `backgrounds: BackgroundSet | undefined`, `page: string` (the current route page), `lowBandwidth: boolean` (skip transition videos and do not play video at all; show posters only).
- One `<video playsinline muted preload="none">` per **unique** `Background` object in the set (mirrored sections share an object; use a `Map<Background, HTMLVideoElement>`), created imperatively in the shadow root when `backgrounds` changes (remove the old ones). Videos are `position: fixed`, centred, 16:9 cover, `hidden` class when not showing.
- On `page` change: find `transitionFor(backgrounds, previousPage, page)`; show that background: set poster, unhide, start loading and playing (`src` set lazily on first use), pause/reset the previous one. When the background has `transition`, listen for `ended` once and continue with the target; otherwise the video loops. Preload the `preload` and `transition` targets (set `src` + `preload="auto"`, set poster). On `lowBandwidth`, skip straight to the end of a transition chain and only set posters.
- No background for the page → hide everything (warn once).
- Handle `play()` rejections (autoplay policy) silently.

#### `overwebs-chat-widget` (legacy: `overwebs-chat-widget` + `overwebs-chat-interaction`)

The bottom-left chat. The chat logic is a `ChatHandler` (`lib/chat.ts`) passed as the `handler` property: the widget sends input through it and shows what it emits, so the server connection can be swapped or removed without touching the widget.

- Properties: `playerName: string` (subscribes to the `player` store in `connectedCallback()`), `messages: ChatMessage[]` (`{ author, channel, message, timestamp }`, newest last), `channel` (default `"General"`), `handler: ChatHandler` (default a `LocalChatHandler`; subscribed and connected while the element is connected, re-attached when replaced).
- Behaviour: collapsed shows the "Press Enter to chat" button and the last messages; focused (`focus` class on host, use `focusin`/`focusout`) expands the log and shows the input with `[General]:` prefix. Enter (via `bindKey("Enter", this)`) focuses the input or submits; Escape (bound with `override` only while focused) blurs. Submitting a non-blank message calls `handler.send(playerName, channel, message)` and clears the input; messages the handler emits are appended with `showMessage()`. Keep scroll-to-bottom when already at the bottom. `tabindex="0"` on the host so it can receive focus.
- Scripted messages (the legacy chat-interaction): 10s after connect, post the introduction from "Ruphin": "Welcome to Overwatch for web!" followed by "Enable fullscreen with F11 for the best experience", or "View on desktop devices for the best experience" on touch screens (`matchMedia("(hover: none) and (pointer: coarse)")`). Drop the "leave me a message" flow (it depended on Firebase). Timers use `disconnectSignal`/clear on disconnect.
- Re-export `ChatMessage` from `lib/chat.ts`.

### Wave 2: pages and the shell

Every page: `<overwebs-player-widget>` top right (except login), `<overwebs-global-button action="back" @click=${back}>` bottom right (except main/login), fade-in animations as the legacy.

#### `overwebs-login-page`

- Form with label "Username", text input (pattern `^([a-zA-Z]+(#[0-9]+)?)?$`, autofocus), two `<overwebs-button variant="yellow">`: "Login" (disabled while the input is empty) and "Anonymous" (disabled while it is not).
- Event `login`: `CustomEvent<LoginRequest>` (`{ anonymous: true }` or `{ username, battleTag? }` split on `#`). Declare in `GlobalEventHandlersEventMap`.

#### `overwebs-main-page`

- Properties: `selection: BackgroundSelection | undefined` (which hero is on screen). Subscribes to `player`.
- Renders `<overwebs-player-widget>`, `<overwebs-main-menu .items=${...}>` with: Play `/play`, Training `/training`, Hero Gallery `/hero-gallery`, Loot Box `/loot` (primary); Social `/social`, Career Profile `/career`, Options `/options`, Exit Game `/exit`. Bottom right: hero name (triple-layer text effect from legacy) and "`<unlocked>/<unlockable>` UNLOCKS" for `selection.hero`.

#### `overwebs-play-page`, `overwebs-training-page`, `overwebs-vs-ai-page`

- Title via `<overwebs-page-title>`; `.modes` row of `<overwebs-play-tile>`s with staggered fade-in, as the legacy templates (titles/descriptions/modes/links copied from legacy HTML).
- Play page: the Quick Play tile dispatches `queue` (`CustomEvent<{ type: string }>` with `"Quick Play"`, bubbles, composed; declare in `GlobalEventHandlersEventMap`). Arcade → `/arcade`, Competitive (`info`) → `/competitive`, Play vs AI → `/vs-ai`. Training: Tutorial, Practice Range, Practice vs AI → `/vs-ai`. VS AI: Easy/Medium/Hard.

#### `overwebs-arcade-page`

- Title "Arcade", the five `<overwebs-arcade-tile>`s laid out as legacy (`big` Mystery Duel, popularity values from the legacy template). Drop the dead `.overlay` CSS.

#### `overwebs-competitive-page`

- Static content from the legacy template (header, text, Season 3, Rewards, info box with the three lists, the buttons). The competitive emblem and info icon SVGs are at `/images/competitive.svg#main` and `/images/info.svg#main` (`<svg><use href=...>`; inline them if `use` with external files is awkward). The `#return` strip and the back button go back.

#### `overwebs-gallery-page`

- Title "HERO GALLERY"; grid of `<overwebs-gallery-hero .hero .unlocks>` for every hero from `heroes`, unlocks from the `player` store. Heroes with `background` link to `/main?background=<id>`; the others are not links. Staggered fade-in (compute `animation-delay` per index inline instead of 26 nth-of-type rules).

#### `overwebs-options-page` (new)

- Title "Options"; the settings from the `settings` store as rows in the style of the game's options screen, centred between the title and the chat: a grey bar with the uppercase name on the left and a `<button role="switch" name=<key>>` stepper on the right showing On/Off between two chevrons; the hovered row turns white and its stepper blue (focus shows only as a ring on the stepper) (no hover state on touch screens). Rows: "Animated Backgrounds (needs high bandwidth)" → `animatedBackgrounds`, "Online Chat" → `onlineChat`, toggled through `updateSettings()`. In portrait the rows span the page between the bars with a narrower value box (a third of the row on phones). Backgrounds: the `options` sections of a set are the hero gallery ones, so the page transitions like the gallery.

#### `overwebs-app`

The shell. Owns routing, login state, backgrounds, the notification and the chat.

- On connect: `restoreSession()`; if no session and the page is not `login`, `navigate("/login", { replace: true })`. With a session and page `""`/`login`/`loading`, go to `/main` (replace). Subscribe to `route`: when `params.background` is set, `selectBackgrounds(value)` and `navigate("/main", { replace: true })`. Otherwise set `page`. Unknown pages: warn and go back (or to `/main`).
- Renders in order: `<overwebs-background .backgrounds .page .lowBandwidth>` (`lowBandwidth` is the opposite of the `animatedBackgrounds` setting (`lib/settings.ts`)), the current page element (looked up in `pages`; `await load()` on first visit and keep a `loaded` set; render nothing while loading; the `exit` route logs out and navigates to `/login`), `<overwebs-notification>` when `queueState.value.queued` with title "Searching for game", message "Estimated time: 1:42" + "Elapsed time: `formatElapsed(now - start)`" (ticking every second while queued), `action="Cancel Search"` → `stopQueue()`; `<overwebs-chat-widget>` hidden on the login page, with the `chat` handler while the `onlineChat` setting is on and a `LocalChatHandler` otherwise.
- Listens for `login` → `login(detail)` → `/main` (replace); `queue` → `startQueue(detail.type)`.
- The main page gets `.selection=${this.selection}`; the background page name for `login` is `login`, selection is chosen once at startup with `selectBackgrounds()`.
- `src/elements/overwebs-app.ts` imports the element modules of background, notification, chat-widget, login-page and main-page eagerly; other pages come from `pages.ts`.

## Removed on purpose

Firebase (auth, database), Google Analytics + autotrack, moment.js, bower, Polymer, webcomponents polyfills, the mobile user-agent regex, the cookie based login, the "leave me a message" chat script, the gallery page `9`/`0` debug keybindings, the commented-out season overlay.
