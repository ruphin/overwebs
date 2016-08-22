'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var map = require('map-stream');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob-all');
var historyApiFallback = require('connect-history-api-fallback');
var packageJson = require('./package.json');
var crypto = require('crypto');

var gutil = require('gulp-util');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var BASEPATH = 'app';
var basepath = function(...subpaths) {
  return subpaths.length == 0 ? BASEPATH : path.join(BASEPATH, ...subpaths);
};

var DIST = 'dist';
var dist = function(...subpaths) {
  return subpaths.length == 0 ? DIST : path.join(DIST, ...subpaths);
};

var TMP = 'tmp';
var tmp = function(...subpaths) {
  return subpaths.length == 0 ? TMP : path.join(TMP, ...subpaths);
};

var scssTask = function(stylesPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return basepath(stylesPath, src);
    }))
    .pipe($.changed(tmp(stylesPath), {extension: '.css'}))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cleanCss())
    .pipe(gulp.dest(tmp(stylesPath)))
    .pipe($.size({title: 'Compile SCSS'}));
};

// Take the SCSS file from each element and generate a -style.html file
var elementScssTask = function(elementsPath, srcs) {
  return gulp.src(srcs.map(function(src) {
      return basepath(elementsPath, src);
    }))
    .pipe($.changed(tmp(elementsPath), {extension: '-style.html'}))
    .pipe($.sass({outputStyle: 'compressed',includePaths: [basepath('styles'), basepath('elements', '**')]}).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cleanCss())
    .pipe(map(function (file, cb) {
      var elementStart = Buffer.from('<dom-module id="' + path.basename(file.path).replace(/\.css$/i, '-style') + '"><template><style>', 'binary');
      var elementEnd = Buffer.from('</style></template></dom-module>', 'binary');
      file.contents = Buffer.concat([elementStart, file.contents, elementEnd]);
      return cb(null, file);
    }))
    .pipe($.rename({
      extname: "-style.html"
    }))
    .pipe(gulp.dest(tmp(elementsPath)))
    .pipe($.size({title: 'Compile Element SCSS'}));
};

gulp.task('scss', function() {
  return scssTask('styles', ['**/*.scss']);
});

gulp.task('elementScss', function() {
  return elementScssTask('elements', ['**/*.scss']);
});

gulp.task('styles', ['scss'], function() {
  return gulp.src(tmp('styles/**/*'))
    .pipe($.changed(dist('styles')))
    .pipe(gulp.dest(dist('styles')))
    .pipe($.size({title: 'Copy Styles'}));
});

gulp.task('images', function() {
  // Remember to pre-optimize images with Kraken.io for better compression
  return gulp.src(basepath('images/**/*'))
    .pipe($.changed(dist('images')))
    .pipe(gulp.dest(dist('images')))
    .pipe($.size({title: 'Copy Images'}));
});

gulp.task('js', function() {
  return gulp.src(basepath('scripts/**/*'))
    .pipe($.changed(dist('scripts')))
    .pipe($.babel({presets: ['es2015']}))
    .pipe(gulp.dest(dist('scripts')))
})

// Copy all files at the root level (app)
gulp.task('base', function() {
  var app = gulp.src(basepath('*'), { dot: true  })
    .pipe(gulp.dest(dist()));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src('vendor/**')
    .pipe($.changed(dist('vendor')))
    .pipe(gulp.dest(dist('vendor')));

  return merge(app, bower)//, tmp)
    .pipe($.size({
      title: 'Copy Base Files'
    }));
});

// Copy web fonts to dist
gulp.task('fonts', function() {
  return gulp.src(['frontend/fonts/**'])
    .pipe(gulp.dest(dist('fonts')))
    .pipe($.size({
      title: 'fonts'
    }));
});

gulp.task('elements', function() {
  return gulp.src(basepath('elements/**/*.html'))
    .pipe($.changed(tmp('elements')))
    .pipe(gulp.dest(tmp('elements')))
    .pipe($.size({title: 'Copy Elements'}));
});

gulp.task('polymer', function() {
  return gulp.src(basepath('bower_components/polymer/**/*'))
    .pipe($.changed(tmp('bower_components/polymer')))
    .pipe(gulp.dest(tmp('bower_components/polymer')))
});

// Vulcanize granular configuration
gulp.task('vulcanize', ['polymer', 'elements', 'elementScss'], function() {
  return gulp.src(tmp('elements/elements.html'))
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(dist('elements')))
    .pipe($.size({title: 'Vulcanize Elements'}));
});

// Generate config data for the <sw-precache-cache> element.
// This include a list of files that should be precached, as well as a (hopefully unique) cache
// id that ensure that multiple PSK projects don't share the same Cache Storage.
// This task does not run by default, but if you are interested in using service worker caching
// in your project, please enable it within the 'default' task.
// See https://github.com/PolymerElements/polymer-starter-kit#enable-service-worker-support
// for more context.
gulp.task('cache-config', function(callback) {
  var dir = dist();
  var config = {
    cacheId: packageJson.name || path.basename(__dirname),
    disabled: false
  };

  glob([
    'index.html',
    './',
    'bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '{elements,scripts,styles}/**/*.*'],
    {cwd: dir}, function(error, files) {
    if (error) {
      callback(error);
    } else {
      config.precache = files;

      var md5 = crypto.createHash('md5');
      md5.update(JSON.stringify(config.precache));
      config.precacheFingerprint = md5.digest('hex');

      var configPath = path.join(dir, 'cache-config.json');
      fs.writeFile(configPath, JSON.stringify(config), callback);
    }
  });
});

// Clean output directory
gulp.task('clean', function() {
  return del([tmp(), dist()]);
});

// Watch files for changes & reload
gulp.task('serve', ['scss', 'elementScss', 'js', 'fonts'], function() {
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'APP',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: [tmp(), basepath(), ''],
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(basepath('*.html'), browserSync.reload);
  gulp.watch(basepath('styles/*.scss'), ['scss', browserSync.reload]);
  gulp.watch(basepath('elements/**/*.scss'), ['elementScss', browserSync.reload]);
  gulp.watch(basepath('elements/**/*.html'), browserSync.reload);
  gulp.watch(basepath('elements/**/*.js'), browserSync.reload);
  gulp.watch(basepath('fonts/*'), browserSync.reload);
  gulp.watch(basepath('scripts/*.js'), browserSync.reload);
  gulp.watch(basepath('images/*'), browserSync.reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'APP',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: [dist()],
      middleware: [historyApiFallback()]
    }
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  // Uncomment 'cache-config' if you are going to use service workers.
  runSequence(
    ['base', 'fonts', 'images', 'styles', 'js', 'vulcanize'],
    // 'cache-config',
    cb);
});

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
//require('web-component-tester').gulp.init(gulp);
