# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Background videos play with sound. When the browser refuses audio before the first interaction, they play muted and sound is turned on at the first click or key press. `<overwebs-background>` has a `muted` property to silence them.

### Added

- Hovering (or pressing) a main menu link shows a beam of light from the left edge of the screen behind it, as in the game: it appears at once, its white band fits the label and tapers into a line that reaches the same point for every link, its core flashes, dips and swells back over 1.8 s above a constant blue-violet halo, then breathes very slightly, and it vanishes at once. Menu links are as wide as their label.

### Changed

- Rewritten from Polymer 1 to GluonJS 3 web components in TypeScript, built with Vite.
- Portrait screens get their own layout. The design canvas is 1280px wide on portrait tablets and 900px on portrait phones instead of 2560px, so the interface is drawn two to three times larger, and every page lays its content out for a tall screen: the player widget in a top bar, the chat and the back button in a bottom bar, and the content between them in a scrolling region that is clipped at both bars. Opened, the chat is a panel from the top bar down to its entry box. The hero gallery shows four cards per row on phones and six on tablets; the play, training, vs. AI and arcade tiles form a grid; the competitive page stacks its two columns.
- Touch screens show the hover effect of menu links, cards and tiles while they are pressed (the link activates on release), no key caps on the hint buttons, and "Chat" instead of "Press Enter to chat".
- Pages use the dynamic viewport height (`100dvh`) and the viewport lets the on-screen keyboard shrink the page, so the chat input stays visible above the keyboard.

### Removed

- Firebase authentication, the Firebase chat message store, Google Analytics and autotrack. Login is now local (stored in `localStorage`) and chat is local only.
- bower, moment.js, the Polymer and webcomponents polyfills.
