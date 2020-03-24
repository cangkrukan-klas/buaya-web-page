const { src, dest, watch, series, parallel, task } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const rimraf = require('rimraf');

const scssPath = './src/scss/**/*.scss'
const jsPath = './src/js/**/*.js'
const imagesPath = './src/images/*'
const faviconPath = './src/favicon.ico'
const fontsPath = './src/fonts/*'

var cbString = new Date().getTime();

function cleanDist(cb) {
    rimraf('./dist/*', function () {
        console.log('Dist directory now empty!')
    });
    cb();
}

function scssTask() {
    return src(scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/css'));
}

function jsTask() {
    return src([jsPath])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('./dist/js'));
}

function cacheBustTask() {
    return src(['./src/index.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('./dist'))
}

function imageTask() {
    return src(imagesPath)
        .pipe(dest('./dist/images'));
}

function faviconTask() {
    return src(faviconPath)
        .pipe(dest('./dist'));
}

function fontsTask() {
    return src(fontsPath)
        .pipe(dest('./dist/fonts'));
}

function watchTask() {
    watch(
        [scssPath, jsPath, imagesPath, faviconPath, fontsPath], 
        {interval: 1000, usePolling: true},
        series(
            parallel(scssTask, jsTask, imageTask, faviconTask, fontsTask),
            cacheBustTask
        ),
    )
}

exports.default = series(
    parallel(scssTask, jsTask, imageTask, faviconTask, fontsTask),
    cacheBustTask,
);

exports.watch = series(
    parallel(scssTask, jsTask, imageTask, faviconTask, fontsTask),
    cacheBustTask,
    watchTask
);

exports.cleanDist = task(cleanDist)