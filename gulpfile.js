/*
 * The MIT License
 *
 * Copyright (c) 2015, Patrick Fitzgerald
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var cache = require('gulp-cache');
var uglify = require('gulp-uglify-es').default;
// clear
// cache.clearAll();

var yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.css'],
  test: ['test/spec/**/*.js'],
  testRequire: [
    yeoman.app + '/bower_components/angular/angular.js',
    yeoman.app + '/bower_components/angular-mocks/angular-mocks.js',
    yeoman.app + '/bower_components/angular-resource/angular-resource.js',
    yeoman.app + '/bower_components/angular-cookies/angular-cookies.js',
    yeoman.app + '/bower_components/angular-sanitize/angular-sanitize.js',
    yeoman.app + '/bower_components/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: yeoman.app + '/index.html',
    files: [ yeoman.app + '/views/**/*.html' ]
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('watch', function () {
  gulp.watch('bower.json', ['bower']);
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app + '/views'));
});

gulp.task('translate', function () {
  return gulp.src(yeoman.app + '/scripts/app/translate/**/*')
    .pipe(gulp.dest(yeoman.dist + '/scripts/app/translate/'));
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('html:app', function () {
  return gulp.src(yeoman.app + '/scripts/app/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/app/views'));
});

gulp.task('html:cluster', function () {
  return gulp.src(yeoman.app + '/scripts/modules/cluster/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/modules/cluster/views'));
});

gulp.task('html:ethiopia', function () {
  return gulp.src(yeoman.app + '/scripts/modules/country/ethiopia/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/modules/country/ethiopia/views'));
});

gulp.task('html:nutrition', function () {
  return gulp.src(yeoman.app + '/scripts/modules/country/afghanistan/nutrition/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/modules/country/afghanistan/nutrition/views'));
});

gulp.task('html:bangladesh', function () {
  return gulp.src(yeoman.app + '/scripts/modules/country/bangladesh/cxb/gfd/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/modules/country/bangladesh/cxb/gfd/views'));
});

gulp.task('html:immap', function () {
  return gulp.src(yeoman.app + '/scripts/modules/immap/views/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/modules/immap/views'));
});

gulp.task('html:drought', function () {
	return gulp.src(yeoman.app + '/scripts/modules/country/afghanistan/drought/views/**/*.html')
		.pipe(gulp.dest(yeoman.dist + '/scripts/modules/country/afghanistan/drought/views'));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', [ 'translate', 'html', 'html:app', 'html:cluster', 'html:ethiopia', 'html:nutrition', 'html:bangladesh', 'html:immap','html:drought', 'styles' ], function () {
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var gulpUtil = require('gulp-util');

  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    // .pipe($.uglify())
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.revReplace())
    // .pipe(header(getLicense()))
    // .pipe(header('/* ' + pkg.name + ' version ' + pkg.version + ' */ \n' ))    
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('rename:index', function () {
  return gulp.src(yeoman.dist + '/*.html')
    .pipe($.rename('/index.html'))
    .pipe(gulp.dest(yeoman.dist));
});

// gulp causing grief on copy, think its memory related
gulp.task('copy:images', function () {
  return gulp.src(yeoman.app + '/images/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});
gulp.task('copy:cluster', function () {
  return gulp.src(yeoman.app + '/images/cluster/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/cluster'));
});
gulp.task('copy:country', function () {
  return gulp.src(yeoman.app + '/images/country/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/country'));
});
gulp.task('copy:cdc', function () {
  return gulp.src(yeoman.app + '/images/snapshots/cdc/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/snapshots/cdc'));
});
gulp.task('copy:drr', function () {
  return gulp.src(yeoman.app + '/images/snapshots/drr/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/snapshots/drr'));
});
gulp.task('copy:snapshots', function () {
  return gulp.src(yeoman.app + '/images/snapshots/immap/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/snapshots/immap'));
});
gulp.task('copy:immap', function () {
  return gulp.src(yeoman.app + '/images/immap/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/immap'));
});
gulp.task('copy:reporthub', function () {
  return gulp.src(yeoman.app + '/images/snapshots/reporthub/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/snapshots/reporthub'));
});
gulp.task('copy:who-immap', function () {
  return gulp.src(yeoman.app + '/images/snapshots/who-immap/**/*.{gif,jpeg,jpg,png,svg}')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images/snapshots/who-immap'));
});


gulp.task('bower:images', function () {
  return gulp.src(yeoman.app + '/../bower_components/**/images/**/*')
    .pipe($.flatten())
    .pipe(gulp.dest(yeoman.dist + '/styles/images'));
});

gulp.task('fullscreen:images', function () {
  return gulp.src(yeoman.app + '/images/fullscreen.png')
    .pipe(gulp.dest(yeoman.dist + '/styles'));
});

gulp.task('copy:static', function () {
  return gulp.src(yeoman.app + '/static/**/*')
    .pipe(gulp.dest(yeoman.dist + '/static'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:icons', function () {
  return gulp.src(yeoman.app + '/styles/iconfont/**/*')
    .pipe(gulp.dest(yeoman.dist + '/styles/iconfont'));
});

gulp.task('copy:widgets', function () {
  // widgets
  gulp.src(yeoman.app + '/scripts/widgets/**/*.js')
    .pipe(gulp.dest(yeoman.dist + '/scripts/widgets'));
  // html
  gulp.src(yeoman.app + '/scripts/widgets/**/*.html')
    .pipe(gulp.dest(yeoman.dist + '/scripts/widgets'));
});

gulp.task('copy:fonts', function () {
  return gulp.src(yeoman.app + '/fonts/**/*')
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('copy:mfonts', function () {
  return gulp.src(yeoman.app + '/../bower_components/materialize/fonts/**/*')
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['copy:images', 'copy:cluster', 'copy:country', 'copy:cdc', 'copy:drr', 'copy:snapshots', 'copy:immap', 'copy:reporthub', 'copy:who-immap', 'bower:images', 'fullscreen:images', 'copy:static', 'copy:extras', 'copy:icons', 'copy:widgets', 'copy:fonts', 'copy:mfonts', 'client:build'], 'rename:index');
});

gulp.task('default', ['build']);

