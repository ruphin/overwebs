# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Background videos play with sound. When the browser refuses audio before the first interaction, they play muted and sound is turned on at the first click or key press. `<overwebs-background>` has a `muted` property to silence them.

### Changed

- Rewritten from Polymer 1 to GluonJS 3 web components in TypeScript, built with Vite.

### Removed

- Firebase authentication, the Firebase chat message store, Google Analytics and autotrack. Login is now local (stored in `localStorage`) and chat is local only.
- bower, moment.js, the Polymer and webcomponents polyfills.
