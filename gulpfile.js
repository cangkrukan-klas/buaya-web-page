const { src, dest, watch, series, parallel, task } = require('gulp')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const replace = require('gulp-replace')
const del = require('del')
const cleanCSS = require('gulp-clean-css')

const cssPath = './src/css/**/*.css'
const jsPath = './src/js/**/*.js'
const assetsPath = './src/assets/**/*'

var cbString = new Date().getTime()

function cleanDist() {
    return del(['dist/**', 'dist'], {force: true})
}

function cssTask() {
    return src(cssPath)
      .pipe(sourcemaps.init())
      .pipe(
        cleanCSS({ level: 2, debug: true }, (details) => {
          console.log(`${details.name}: ${details.stats.originalSize}`)
          console.log(`${details.name}: ${details.stats.minifiedSize}`)
        })
      )
      .pipe(sourcemaps.write())
      .pipe(dest("./dist/css"))
}

function jsTask() {
    return src([jsPath])
        .pipe(uglify())
        .pipe(dest('./dist/js'))
}

function cacheBustTask() {
    return src(['./src/index.html', './src/404.html', './src/500.html'])
        .pipe(replace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('./dist'))
}

function assetsTask() {
    return src(assetsPath)
        .pipe(dest('./dist/assets'))
}

function watchTask() {
    watch(
        [cssPath, jsPath, assetsPath],
        {interval: 1000, usePolling: true},
        series(
            cleanDist,
            parallel(cssTask, jsTask, assetsTask),
            cacheBustTask
        ),
    )
}

exports.default = series(
    cleanDist,
    parallel(cssTask, jsTask, assetsTask),
    cacheBustTask,
)

exports.watch = series(
    cleanDist,
    parallel(cssTask, jsTask, assetsTask),
    cacheBustTask,
    watchTask
)

exports.cleanDist = task(cleanDist)