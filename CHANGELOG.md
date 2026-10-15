# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- An options page, from the main menu, in the style of the game's options screen (grey rows with a translucent blue On/Off stepper, the hovered row white and its stepper solid blue) with two settings. "Animated Backgrounds (needs high bandwidth)": on, the background videos play; off, only their poster images are shown. Until it is set, videos play unless the device prefers saving data (data saver, or a touch-only device). "Online Chat": on, the chat is shared through the chat server; off, messages stay on the player's screen. Settings are kept in `localStorage`. The page uses the hero gallery backgrounds and transitions.
- The chat is shared: messages are posted to the chat server at `/api/chat/messages` and everyone in the chat sees them, received by long-polling that pauses while the page is hidden. Refused posts (too fast, too many, too long) are explained by a message from "System". The chat widget takes a `handler` (`ChatHandler` in `lib/chat.ts`): `ApiChatHandler` talks to the server, `LocalChatHandler` keeps messages local, as before.

- Background videos play with sound. When the browser refuses audio before the first interaction, they play muted and sound is turned on at the first click or key press. `<overwebs-background>` has a `muted` property to silence them.

### Added

- Hovering (or pressing) a main menu link shows a beam of light from the left edge of the screen behind it, as in the game: it appears at once, its white band fits the label and tapers into a line that reaches the same point for every link, its core flashes, dips and swells back over 1.8 s above a constant blue-violet halo, then breathes very slightly, and it vanishes at once. Menu links are as wide as their label.

### Fixed

- The "Anonymous" button on the login page is as wide as the username field and the "Login" button; its label made it wider.
- The Overwatch cursor stays over links, buttons and inputs, which showed the browser's pointer, arrow or I-beam cursor.

### Changed

- The welcome message in the chat greets "Overwatch for web" and tells touch screens to view on a desktop instead of suggesting F11.
- The chat is a fifth wider in landscape (640 instead of 534 design units).
- The main menu sits one line of the PLAY label higher in landscape, leaving more room for the chat below it.
- "Exit Game" ends the login session and returns to the login screen, instead of showing a black screen that links home.
- Every way to start a game queues: Quick Play, Custom Game, every arcade mode, Competitive Play's Play button, the tutorial, the practice range and the AI difficulties all show the "Searching for game" notification. Its divider and Cancel button take the primary colour of the mode's tile (blue for Quick Play, green for the arcade modes, purple for competitive, ...), and starting a search drops back to the main page.
- Rewritten from Polymer 1 to GluonJS 3 web components in TypeScript, built with Vite.
- Portrait screens get their own layout. The design canvas is 1280px wide on portrait tablets and 900px on portrait phones instead of 2560px, so the interface is drawn two to three times larger, and every page lays its content out for a tall screen: the player widget in a top bar, the chat and the back button in a bottom bar, and the content between them in a scrolling region that is clipped at both bars. Opened, the chat is a panel from the top bar down to its entry box. The hero gallery shows four cards per row on phones and six on tablets; the play, training, vs. AI and arcade tiles form a grid; the competitive page stacks its two columns.
- Touch screens show the hover effect of menu links, cards and tiles while they are pressed (the link activates on release), no key caps on the hint buttons, and "Chat" instead of "Press Enter to chat".
- Pages use the dynamic viewport height (`100dvh`) and the viewport lets the on-screen keyboard shrink the page, so the chat input stays visible above the keyboard.

### Removed

- The Loot Box, Social and Career Profile entries of the main menu, which led nowhere.
- Firebase authentication, the Firebase chat message store, Google Analytics and autotrack. Login is now local (stored in `localStorage`) and chat is local only.
- bower, moment.js, the Polymer and webcomponents polyfills.
