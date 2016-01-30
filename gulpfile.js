/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var wrench = require('wrench');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});



// /*
//  * The MIT License
//  *
//  * Copyright (c) 2015, Patrick Fitzgerald
//  *
//  * Permission is hereby granted, free of charge, to any person obtaining a copy
//  * of this software and associated documentation files (the 'Software'), to deal
//  * in the Software without restriction, including without limitation the rights
//  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  * copies of the Software, and to permit persons to whom the Software is
//  * furnished to do so, subject to the following conditions:
//  *
//  * The above copyright notice and this permission notice shall be included in
//  * all copies or substantial portions of the Software.
//  *
//  * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  * SOFTWARE.
//  */

// // including plugins
// var pkg = require('./package.json'),
//     fs = require('fs'),
//     gulp = require('gulp'),
//     ngmin = require('gulp-ngmin'),
//     gulpFilter = require('gulp-filter')
//     jshint = require('gulp-jshint'),
//     htmlreplace = require('gulp-html-replace'),
//     minifyHtml = require('gulp-minify-html'),
//     minifyCss = require('gulp-minify-css'),
//     uglify = require('gulp-uglify'),
//     flatten = require('gulp-flatten'),
//     concat = require('gulp-concat'),
//     header = require('gulp-header'),
//     rename = require('gulp-rename'),
//     mainBowerFiles = require('main-bower-files');

// // destination
// var destination = 'dist',
//     jsFilter = gulpFilter('*.js'),
//     cssFilter = gulpFilter('*.css'),
//     fontFilter = gulpFilter(['*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']);

// // License
// var getLicense = function () {
//   var license = '/* '
//       license += fs.readFileSync('LICENSE.md');
//       license += ' */ \n';

//   return license;
// };

// /* JS LINT  *****************************************/

// // js linting
// gulp.task('jsLint', function () {
//   gulp.src('app/**/*.js')
//   .pipe(jshint())
//   .pipe(jshint.reporter());
// });

// /* BOWER  *****************************************/

// // bower js
// gulp.task('minify-bower-js', function () {
//   gulp.src(mainBowerFiles())
//     // vendor js
//     .pipe(jsFilter)
//     // .pipe(ngmin())
//     // .pipe(uglify())
//     .pipe(concat('js/vendor.js'))
//     .pipe(gulp.dest(destination))
// });
// // bower css
// gulp.task('minify-bower-css', function () {
//   gulp.src(mainBowerFiles())
//     // vendor css
//     .pipe(cssFilter)
//     .pipe(minifyCss())
//     .pipe(concat('css/vendor.css'))
//     .pipe(gulp.dest(destination))
// });
// // bower font
// gulp.task('minify-bower-font', function () {
//   gulp.src(mainBowerFiles())
//     // venor fonts
//     .pipe(fontFilter)
//     .pipe(flatten())
//     .pipe(gulp.dest(destination + '/font/roboto'));
// });
 
//  /* NGM  *****************************************/

// // images
// gulp.task('copy-ngm-images', function () {
//   // images
//   gulp.src('app/images/**/*')
//   .pipe(gulp.dest(destination + '/images'));
// });
// // ngm widgets
// gulp.task('copy-ngm-widgets', function () {
//   // widgets
//   gulp.src('app/widgets/**/*.js')
//   .pipe(ngmin())
//   .pipe(gulp.dest(destination + '/widgets'));
//   // html
//   gulp.src('app/widgets/**/*.html')
//   .pipe(gulp.dest(destination + '/widgets'));
// });
// // minify js
// gulp.task('minify-ngm-js', function () {
//   gulp.src(['app/**/*.js', '!app/widgets/**/*.js'])
//   // .pipe(ngmin())
//   // .pipe(uglify())
//   .pipe(concat('js/ngm.js'))
//   .pipe(header(getLicense()))
//   .pipe(header('/* ' + pkg.name + ' version ' + pkg.version + ' */ \n' ))
//   .pipe(gulp.dest(destination));
// });
// // minify css
// gulp.task('minify-ngm-css', function () {
//   gulp.src('app/**/*.css')
//     .pipe(minifyCss())
//     .pipe(concat('css/ngm.css'))
//     .pipe(gulp.dest(destination));
// });
// // include minimised css/js
// gulp.task('minify-ngm-html', function () {
//   gulp.src('app/index.html')
//     //
//     .pipe(
//       htmlreplace({ 
//         bowercss: '<link rel="stylesheet" href="css/vendor.css" />',
//         ngmcss: '<link rel="stylesheet" href="css/ngm.css" />',
//         bowerjs: '<script src="js/vendor.js"></script>',
//         ngmjs: '<script src="js/ngm.js"></script>'
//       }))
//     .pipe(minifyHtml())
//     .pipe(gulp.dest(destination));
// });

// // bower 
// gulp.task('bower', ['minify-bower-js', 'minify-bower-css', 'minify-bower-font']);
// // ngm
// gulp.task('ngm', ['copy-ngm-widgets', 'copy-ngm-images', 'minify-ngm-js', 'minify-ngm-css', 'minify-ngm-html']);
// //package
// gulp.task('build', ['bower', 'ngm']);

