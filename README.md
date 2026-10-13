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

Components follow the rules in `PLAN.md`: a pure class in `src/components/`,
a registering module in `src/elements/`, data passed as properties, reactive
`static properties`, styles in `static styles`.

## Deployment

The app runs at https://overwatch.ruphin.net. The production build is packed
into the ruphin.net webserver: see `./build.sh overwebs` in
[ruphin.net](https://github.com/ruphin/ruphin.net).
