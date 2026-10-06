# Overwebs

https://overwebs.ruph.in/main

A Polymer 1 application built from HTML imports. Its front-end dependencies are
installed with bower into `vendor/` (this runs automatically after `npm install`),
and Vite serves and builds the app.

## Development

```sh
npm install        # installs npm dev dependencies and the bower packages
npm run dev        # dev server on http://localhost:5000
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run deploy     # deploy to production (ssh s.ruph.in ./overwebs.sh)
```
