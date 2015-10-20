'use strict';

var gulp = require('gulp');

var sass       = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var imagemin   = require('gulp-imagemin');
var minifycss  = require('gulp-csso');
var sourcemap  = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var concatcss  = require('gulp-concat-css');


var paths = {
  scripts: 'dev/js/*.js',
  images: 'dev/images/**',
  scss: 'dev/scss/*.scss',
  scripts_pub: 'public/js/',
  images_pub: 'public/images/',
  scss_pub: 'public/css/'
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
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(sourcemap.write('../map'))
    .pipe(gulp.dest('dev/css/'));
});

gulp.task('concat', function () {
  return gulp.src('dev/css/*.css')
    .pipe(concatcss("main.css"))
    .pipe(gulp.dest(paths.scss_pub));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.scss, ['scss']);
  gulp.watch('dev/css/*.css', ['concat']);
});

gulp.task('production', function () {
  gulp.src('public/css/main.css')
    .pipe(autoprefix())
    .pipe(rename({
      dirname: "/",
      suffix: ".min"
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.scss_pub));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'images', 'scss', 'concat']);
