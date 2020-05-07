const { src, dest, watch, series, parallel, task } = require("gulp");
const uglify = require('gulp-uglify')
const replace = require("gulp-replace");
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const webp = require("gulp-webp");
const purgeCSS = require("gulp-purgecss");

const cssPath = "./src/css/**/*.css";
const jsPath = "./src/js/**/*.js";
const htmlPath = "./src/*.html";
const imagePath = "./src/assets/**/*.png";
const assetsPath = [
  "./src/assets/**/*",
];

var cbString = new Date().getTime();

function cleanDist() {
  return del(["dist/**", "dist"], { force: true });
}

function cssTask() {
  return (
    src(cssPath)
      //   .pipe(purify([jsPath, htmlPath], { minify: true }))
      .pipe(purgeCSS({ content: [htmlPath, jsPath], stdout: true }))
      .pipe(
        cleanCSS({ level: 2, debug: true }, (details) => {
          console.log(`${details.name}: ${details.stats.originalSize}`);
          console.log(`${details.name}: ${details.stats.minifiedSize}`);
        })
      )
      .pipe(dest("./dist/css"))
  );
}

function jsTask() {
  return src([jsPath]).pipe(uglify()).pipe(dest("./dist/js"));
}

function cacheBustTask() {
  return src(["./src/index.html", "./src/404.html", "./src/500.html"])
    .pipe(replace(/cb=\d+/, "cb=" + cbString))
    .pipe(replace(".png", ".webp"))
    .pipe(dest("./dist"));
}

function assetsTask() {
  return src(assetsPath).pipe(dest("./dist/assets"));
}

function imageTask() {
  return src(imagePath).pipe(webp()).pipe(dest("./dist/assets"));
}

function watchTask() {
  watch(
    [cssPath, jsPath, assetsPath, imagePath],
    { interval: 1000, usePolling: true },
    series(
      cleanDist,
      parallel(cssTask, assetsTask, jsTask, cacheBustTask, imageTask)
    )
  );
}

exports.default = series(
  cleanDist,
  parallel(cssTask, assetsTask, jsTask, cacheBustTask, imageTask)
);

exports.watch = series(
  cleanDist,
  parallel(cssTask, assetsTask, jsTask, cacheBustTask, imageTask),
  watchTask
);

exports.cleanDist = task(cleanDist);
