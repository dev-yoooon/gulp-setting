
const { src, dest, series, parallel, watch, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const path = require('path');
const $ = require('gulp-load-plugins')();
const through = require('through2')

const dir = {
  src: {
    html: './src/html/**/!(_)*.{html,ejs}',
    scss: './src/assets/scss/**/*.scss',
    js: './src/assets/js/**/*.js'
  },
  dist: {
    html: './dist/html/',
    css: './dist/assets/css',
    js: './dist/assets/js/'
  }
}

const clean = () => {
	return src(['./dist'])
		.pipe($.clean())
}

const server = async () => {
  $.connect.server({
    port: '1119',
    root: './dist',
    livereload: true,
  })
}

const html = async () => { 
  return src([dir.src.html])
		.pipe($.plumber())
    .pipe($.fileInclude())
    .pipe($.htmlTagInclude())
    .pipe($.ejs())
    .pipe($.prettier())
    .pipe(dest(dir.dist.html))
    .pipe($.connect.reload())
}

const scss = async () => {
  return src([dir.src.scss])
    .pipe($.plumber())
    .pipe($.fileInclude())
    .pipe(sass({
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(dest(dir.dist.css))
    .pipe($.connect.reload())
}

const image = async () => {  }

const watcher = async () => {
  watch([ './src/html/**/*.{html,ejs}' ], html)
  watch([ dir.src.scss ], scss)
}

exports.clean = series(clean);
exports.default = series(html, scss, parallel(watcher, server));
