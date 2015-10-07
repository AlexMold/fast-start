'use strict';

var gulp = require('gulp');

var sass       = require('gulp-sass');
var autoprefix = require('autoprefixer');
var imagemin   = require('imagemin');
var minifycss  = require('gulp-minify-css');
var sourcemap  = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');


var paths = {
  scripts: 'dev/js/*.js',
  images: 'dev/images/*',
  scss: 'dev/scss/main.scss',
  scripts_pub: 'public/js/*.js',
  images_pub: 'public/images/*',
  scss_pub: 'public/css/main.css'
};

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts_pub));
});

// Copy all static images
gulp.task('images', function () {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(paths.images_pub));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(sourcemap())
    .pipe(gulp.dest(paths.scss_pub));
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts_pub, ['scripts']);
  gulp.watch(paths.images_pub, ['images']);
  gulp.watch(paths.scss_pub, ['scss']);
});

gulp.task('production', function () {
  gulp.src(paths.scss_pub)
    .pipe(autoprefix())
    .pipe(rename({
      dirname: "public/css/",
      suffix: ".min"
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.scss_pub));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'images', 'scss']);