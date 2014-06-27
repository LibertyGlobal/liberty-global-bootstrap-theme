var util = require('util');
var argv = require('yargs').argv;
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css');
var header = require('gulp-header');
var bump = require('gulp-bump');
var pkg = require('./package.json');
var banner = [
  '/**',
  ' * <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  ''
].join('\n');


// Run build by default

gulp.task('default', [ 'build' ]);


// Clean up the output directory

gulp.task('clean', function () {
  return gulp.src('./dist').pipe(clean({ force: true }));
});


// Compile the LESS file

gulp.task('build', [ 'clean' ], function () {
  return gulp.src('./src/' + pkg.name + '.less')
    .pipe(plumber({ errorHandler: util.error }))
    .pipe(less())
    .pipe(prefix('last 2 versions', 'ie 9'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(pkg.name + '.min.css'))
    .pipe(minify())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'));
});


gulp.task('bump', function () {
  var type = argv.t || 'minor';

  gulp.src([ './package.json', './bower.json' ])
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'));
});


// Watch all files in the source directory and re-run
// the build on each change

gulp.task('watch', [ 'build' ], function () {
  gulp.watch('./src/**/*.*', [ 'build' ]);
});