'use strict';

/**
 * Modules
 */
var gulp = require('gulp')
    , runSequence = require('run-sequence')
    , concat = require('gulp-concat')
    , clean = require('gulp-clean')
    , uglify = require('gulp-uglify')
    , jshint = require('gulp-jshint')
    , livereload = require('gulp-livereload')
    , notify = require('gulp-notify')
    , stylish = require('jshint-stylish')
    , sourcemaps = require('gulp-sourcemaps')
    , sass = require('gulp-ruby-sass')
    , minifycss = require('gulp-minify-css')
    , plumber = require('gulp-plumber');

/**
 * Paths
 */
var app = 'app/',
    dist = 'dist/',
    theme_path = '',
    src = {
      img: theme_path + app + 'img/**/*',
      scss: theme_path + app + 'sass/**/**/*.scss',
      sassmap: theme_path + app + './sass/**/*',
      js: theme_path + app + 'js/**/*.js',
      fonts: theme_path + app + 'fonts/**/*',
      unit: theme_path + app + 'test/**/*.js'
    }
  , dest = {
    img: theme_path + dist + 'img',
    css: theme_path + dist + 'css',
    js: theme_path + dist + 'js',
    fonts: theme_path + dist + 'fonts'
};

/**
 * CSS Vendors
 */
gulp.task('css_vendors', function () {

  return gulp.src([
    // theme_path + 'node_modules/font-awesome/css/font-awesome.css'
  ])
  .pipe(concat('vendors.css'))
  .pipe(minifycss())
  .pipe(gulp.dest(dest.css));
});

/**
 * JS Vendors
 * (with jQuery and Bootstrap dependencies first)
 */
gulp.task('js_vendors', function () {
  return gulp.src([
    theme_path + 'node_modules/chosen-js/chosen.jquery.js'
  ])
  .pipe(concat('vendors.js'))
  .pipe(uglify())
  .pipe(gulp.dest(dest.js));
});

/**
 * Build Sass
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task('css', function () {
  return gulp.src(src.scss)
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass())
    .pipe(plumber.stop())
    .pipe(sourcemaps.write(''))
    .pipe(minifycss())
    .pipe(gulp.dest(dest.css))
    .pipe(notify('Sass compiled & minified'))
    .pipe(livereload());
});

/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 * And jshint check to highlight errors as we go.
 */
gulp.task('js', function () {
  return gulp.src([
    theme_path + app + 'js/main.js',
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest(dest.js))
  .pipe(notify('JS concat & uglified'))
  .pipe(livereload());
});


/**
 * Copy fonts
 */
gulp.task('fonts', function () {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(dest.fonts))
    .pipe(notify('Fonts copied'))
    .pipe(livereload());
});


/**
 * Cleans Build directory
 */
gulp.task('clean', function () {
  return gulp.src([theme_path + dist + '/js', theme_path + dist + '/css'], {read: false})
    .pipe(clean());
});

/**
 * Gulp build
 */
gulp.task('build', function (callback) {
  runSequence('clean',
    ['js', 'js_vendors', 'css', 'css_vendors', 'fonts'],
    callback);
});

/**
 * Gulp watch
 */
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(src.scss, ['css']);
  gulp.watch(src.js, ['js']);
});