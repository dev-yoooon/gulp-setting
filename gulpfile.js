
const { src, dest, series, parallel, watch, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const $ = require('gulp-load-plugins')();
const path = require('path');

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

const html = async () => {
  return src([dir.src.html])
		.pipe($.plumber())
    .pipe($.fileInclude())
    .pipe($.ejs())
    .pipe(dest(dir.dist.html))
    .pipe($.connect.reload())
}

const build = async () => {
	return src([`${dir.dist.html}**/*.html`])
		.pipe($.prettier())
		.pipe(dest(dir.dist.html))
}

const scss = async () => {
  return src([dir.src.scss])
  .pipe($.plumber())
    .pipe($.fileInclude())
    .pipe(sass({
      outputStyle: 'compressed'
    })).on('error', sass.logError)
    .pipe(dest(dir.dist.css))
}

const server = async () => {
  $.connect.server({
    port: '1119',
    root: './dist',
    livereload: true,
  })
}

const watcher = async () => {
  watch([ dir.src.html ], html)
  watch([ dir.src.scss ], scss)
}

task('clean', clean);
task('html', html);
task('build', build);

exports.default = series(html, scss, watcher, server );
