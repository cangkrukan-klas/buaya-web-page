const { src, dest, watch, series, parallel, task } = require("gulp");
const uglify = require("gulp-uglify");
const replace = require("gulp-replace");
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const webp = require("gulp-webp");
const purgeCSS = require("gulp-purgecss");

const cssPath = "./src/css/**/*.css";
const jsPath = "./src/js/**/*.js";
const htmlPath = "./src/*.html";
const imagePath = "./src/images/**/*.png";
const vendorPath = "./src/vendor/**/*";
const faviconPath = "./src/images/favicon/favicon.ico";

var cbString = new Date().getTime();

function cleanDist() {
  return del(["dist/**", "dist"], { force: true });
}

function cssTask() {
  return src(cssPath)
    .pipe(purgeCSS({ content: [htmlPath, jsPath], stdout: true }))
    .pipe(
      cleanCSS({ level: 2, debug: true }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(dest("./dist/css"));
}

function jsTask() {
  return src([jsPath]).pipe(uglify()).pipe(dest("./dist/js"));
}

function cacheBustTask() {
  return src(htmlPath)
    .pipe(replace(/cb=\d+/, "cb=" + cbString))
    .pipe(replace(".png", ".webp"))
    .pipe(dest("./dist"));
}

function vendorTask() {
  return src(vendorPath).pipe(dest("./dist/vendor"));
}

function imageTask() {
  return src(imagePath).pipe(webp()).pipe(dest("./dist/images"));
}

function faviconTask() {
  return src(faviconPath).pipe(dest("./dist"));
}

function watchTask() {
  watch(
    [cssPath, jsPath, vendorPath, imagePath, faviconPath],
    { interval: 1000, usePolling: true },
    series(
      cleanDist,
      parallel(
        cssTask,
        vendorTask,
        jsTask,
        cacheBustTask,
        imageTask,
        faviconTask
      )
    )
  );
}

exports.default = series(
  cleanDist,
  parallel(cssTask, vendorTask, jsTask, cacheBustTask, imageTask, faviconTask)
);

exports.watch = series(
  cleanDist,
  parallel(cssTask, vendorTask, jsTask, cacheBustTask, imageTask, faviconTask),
  watchTask
);

exports.cleanDist = task(cleanDist);
