// Need to simplify runner =)
'use strict';

// Module except unclear errors
require('clarify');

// Low level File work
const fs          = require("fs");

// Gulp modules
const gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      notify      = require("gulp-notify"),
      autoprefix  = require('gulp-autoprefixer'),
      imageop     = require('gulp-image-optimization'),
      concat      = require('gulp-concat'),
      server      = require('gulp-server-livereload');

// PostCSS and plugins
const postcss         = require('gulp-postcss'),
      pxtorem         = require('postcss-pxtorem'),
      csspropsort     = require('css-property-sorter'),
      cssgrace        = require('cssgrace'),
      autoprefixer    = require('autoprefixer'),
      classPrfx       = require('postcss-class-prefix'),
      cssstats        = require('postcss-cssstats'),
      stylelint       = require('gulp-stylelint');
      //slf             = require('stylelint-formatter');




// Config's
let config = {
    sassPath: './resources/sass',
    cssPath: './public/css/'
}
let plugins = {
    path: ['./public/lib/',
            './public/lib/']
}
let styleConfig = {
  "rules": {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "function-comma-space-after": "always",
    "function-url-quotes": "double",
    "media-feature-colon-space-after": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-name-no-vendor-prefix": true,
    "max-empty-lines": 5,
    "number-leading-zero": "never",
    "number-no-trailing-zeros": true
  }
}
let processors = [
    pxtorem({
        rootValue: 16,
        unitPrecision: 5,
        propWhiteList: ['font', 'font-size', 'line-height', 'letter-spacing', 'height'],
        selectorBlackList: [],
        replace: false,
        mediaQuery: false,
        minPixelValue: 0
    }),
    autoprefixer,
    //csspropsort({order: 'smacss'}),
    cssgrace
    //classPrfx('yo.')
];




gulp.task('cssstats', function() {
  return gulp
    .src(`${config.cssPath}style.css`)
    .pipe(
      stylelint({
        failAfterError: true,
        reportOutputDir: 'logs/lint/',
        reporters: [
          {formatter: '.scss-lint.yml', save: 'my-custom-report.txt'}
        ],
        debug: true
      })
    )
    .pipe(
    postcss([
      cssstats((stats) => {
        let str = JSON.stringify(stats, "", 2);
        fs.writeFile(`${__dirname}/logs/statMessage.txt`, str, (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        });
        }
      )
    ])
  );
});


// Tasks

gulp.task('scripts', () => {
  return gulp.src(plugins.path)
    .pipe(concat('plugin.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('images', (cb) => {
    gulp.src(['resources/**/*.png','resources/**/*.jpg','resources/**/*.gif','resources/**/*.jpeg'])
    .pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('public')).on('end', cb).on('error', cb);
});

gulp.task('copy:font', () => {
     return gulp.src('./resources/fonts/*')
         .pipe(gulp.dest('./public/fonts'));
});

gulp.task('css', () => {
    return gulp.src(config.sassPath + '/style.scss')
        .pipe(
          sass()
            .on("error", notify.onError((error) => {
                return `Error: ${error.message}`;
            }))
        )
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('analize', () => {

})

// Server for reload
gulp.task('webserver', () => {
  gulp.src('.')
    .pipe(server({
      livereload: {
        enable: true
      },
      directoryListing: true,
      open: true
    }));
});


// Rerun the task when a file changes
// But at first launch server
gulp.task('watch', () => {
    gulp.watch(`${config.sassPath}/**/*.scss`, ['css']);
    gulp.watch(`plugin.path`, ['scripts']);
});

gulp.task('default', ['icons', 'css', 'images']);
