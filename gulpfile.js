'use strict';

var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    less = require('gulp-less');
 
gulp.task('default', function () {
  gulp.src('css/*.less')
    .pipe(concat("bundle.less"))
    .pipe(less("bundle.css"))
    .pipe(autoprefixer('> 1%', 'last 5 versions', 'Firefox ESR', 'ie 9'))
    .pipe(minifyCss(""))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
  gulp.watch('css/*.less', ['default'])
})