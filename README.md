# Overwebs

Overwatch for the web: a recreation of the Overwatch main menus as a web
application, built from [GluonJS](https://github.com/ruphin/gluonjs) web
components in TypeScript and served with Vite.

## Development

```sh
npm install
npm run dev        # dev server on http://localhost:5000
npm run build      # production build in dist/
npm run preview    # serve the production build
npm test           # run the tests once (test:watch for watch mode)
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write (format:check to verify only)
npm run check      # typecheck + format:check + test
```

### The chat

The chat widget renders messages and takes input; the logic behind it is a
`ChatHandler` from `src/lib/chat.ts` passed as its `handler` property, chosen
in `src/components/overwebs-app.ts`. `ApiChatHandler` shares messages through
the chat server of [ruphin.net](https://github.com/ruphin/ruphin.net) at
`/api/chat/messages`; `LocalChatHandler` keeps them on the player's own
screen. In development, Vite proxies `/api` to `API_PROXY` (default
`http://localhost:8080`) with the host the server routes overwebs by, so run
that redbean locally with `sh ./redbean.com -p 8080`. Without it the chat
retries quietly and reports sent messages as unreachable.

## Layout

```
.
├── index.html              The application page
├── public/                 Static assets, served at /
│   ├── fonts/              Big Noodle Too Oblique, Futura, Helvetica
│   ├── backgrounds/        Main menu background videos per map and hero
│   ├── avatars/            Player avatars
│   ├── heroes/             Hero gallery portraits
│   ├── tiles/, arcade/     Play and arcade mode artwork
│   └── images/             Icons, cursor, app icon
├── src/
│   ├── main.ts             Entry: global styles, router, <overwebs-app>
│   ├── index.ts            Pure barrel: every component class and lib module. No side effects.
│   ├── styles/global.css   @font-face, the --u design unit, cursor
│   ├── lib/                Non-component code: data, stores, router, keybindings
│   ├── components/         Custom element classes. Pure: no define() here. Tests next to the code.
│   └── elements/           Registering entrypoints, one per element (define + HTMLElementTagNameMap)
├── test/                   Tests that are not tied to one source file
└── PLAN.md                 The rewrite plan and component contract
```

The interface is designed on a 2560px wide canvas and scales with the viewport
width: one design pixel is `var(--u)`, so a size that is 80px in the design is
written as `calc(80 * var(--u))`.

Portrait screens use a narrower canvas (1280px on tablets, 900px on phones), so
the same design pixel is two to three times larger on them. Components carry a
`@media (orientation: portrait)` block with their portrait layout: the player
widget in the top bar, the chat and the back button in the bottom bar, and the
page content between them in a scrolling region clipped at both bars
(`--top-bar`, `--bottom-bar` and `--page-gutter` in `global.css`). Touch screens
(`hover: none`) show the hover effects while an element is pressed (`:active`)
and no keyboard hints.

Components follow the rules in `PLAN.md`: a pure class in `src/components/`,
a registering module in `src/elements/`, data passed as properties, reactive
`static properties`, styles in `static styles`.

## Deployment

The app runs at https://overwatch.ruphin.net. The production build is packed
into the ruphin.net webserver: see `./build.sh overwebs` in
[ruphin.net](https://github.com/ruphin/ruphin.net).
