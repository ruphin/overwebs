import { defineConfig } from 'vite';
import * as sass from 'sass';
import fs from 'node:fs';
import path from 'node:path';

// This app is a Polymer 1 application built from HTML imports, with its
// dependencies installed by bower into ./vendor. Vite cannot bundle HTML
// imports, so the element files and vendor packages are served (and copied
// into dist) as static files. Each element's SCSS file is compiled into a
// `<name>-style.html` dom-module that the element imports.

const APP = path.resolve('app');
const ELEMENTS = path.join(APP, 'elements');
const VENDOR = path.resolve('vendor');

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function compileElementStyle(scssFile) {
  const { css } = sass.compile(scssFile, { style: 'compressed' });
  const id = path.basename(scssFile, '.scss') + '-style';
  return `<dom-module id="${id}"><template><style>${css}</style></template></dom-module>`;
}

function styleSourceFor(file) {
  if (!file.endsWith('-style.html')) return null;
  const scss = file.replace(/-style\.html$/, '.scss');
  return fs.existsSync(scss) ? scss : null;
}

function polymerStatic() {
  return {
    name: 'polymer-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0]);
        let base;
        if (url.startsWith('/elements/')) base = ELEMENTS;
        else if (url.startsWith('/vendor/')) base = VENDOR;
        else return next();

        const file = path.join(base, url.replace(/^\/(elements|vendor)\//, ''));
        if (!file.startsWith(base + path.sep)) return next();

        try {
          const scss = base === ELEMENTS && styleSourceFor(file);
          let body;
          if (scss) {
            body = compileElementStyle(scss);
          } else if (fs.statSync(file, { throwIfNoEntry: false })?.isFile()) {
            body = fs.readFileSync(file);
          } else {
            res.statusCode = 404;
            return res.end('Not found');
          }
          res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(body);
        } catch (err) {
          server.config.logger.error(err.message);
          res.statusCode = 500;
          res.end(err.message);
        }
      });
      // Reload the page when element or style sources change.
      server.watcher.add(ELEMENTS);
      server.watcher.on('change', (file) => {
        if (file.startsWith(ELEMENTS)) server.ws.send({ type: 'full-reload' });
      });
    },
    closeBundle() {
      const outDir = path.resolve('dist');
      // Copy every static app file except index.html (handled by Vite) and SCSS sources.
      fs.cpSync(APP, outDir, {
        recursive: true,
        filter: (src) => src !== path.join(APP, 'index.html') && !src.endsWith('.scss'),
      });
      // Compile the element styles into their -style.html modules.
      for (const entry of fs.readdirSync(ELEMENTS, { recursive: true })) {
        if (!entry.endsWith('.scss')) continue;
        const scss = path.join(ELEMENTS, entry);
        const out = path.join(outDir, 'elements', entry.replace(/\.scss$/, '-style.html'));
        fs.writeFileSync(out, compileElementStyle(scss));
      }
      fs.cpSync(VENDOR, path.join(outDir, 'vendor'), { recursive: true });
    },
  };
}

export default defineConfig({
  root: 'app',
  publicDir: false,
  plugins: [polymerStatic()],
  server: { port: 5000 },
  preview: { port: 5000 },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
