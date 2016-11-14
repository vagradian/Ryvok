var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss"); 
var autoprefixer = require("autoprefixer");
 var mqpacker = require("css-mqpacker"); 
var minify = require("gulp-csso"); 
var rename = require("gulp-rename"); 
var imagemin = require("gulp-imagemin");
var browserSync = require("browser-sync");
var del = require("del");
var copy = require("gulp-contrib-copy");


// style tasks
gulp.task("style", function () {
    return gulp.src("src/scss/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([ 
            autoprefixer ({browsers: [ "last 2 version"]}), 
            mqpacker({ sort:true }) 
        ]))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({stream:true}))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("src/css"))
});


// browser-sync tasks
gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "src"
        },
        notify: false
    });
});


gulp.task("build:serve", function() {
    browserSync({
       server: {
           baseDir: "build"
       },
        notify: false
    });
});


// task to clear all files and folders from build folder
gulp.task("build:clean", function() {
    del([
       "build/"
    ]);
});


// task to create build directory for all files
gulp.task("build:copy", ["build:clean"] , function() {
    return gulp.src("src/**/**/")
        .pipe(gulp.dest("build/"))
});


// task to remove unwanted build files
// list all files and directories here that you don't want to include
gulp.task("build:remove", ["build:copy"], function() {
    del([
        "build/scss/"
    ]);
});


// task to minify all images
gulp.task("build:images", ["build:remove"], function() {
    return gulp.src("build/img/*.png")
        .pipe(imagemin({ progressive: true}))
        .pipe(gulp.dest("build/img"));
});


// task to build
gulp.task("build", ["build:copy", "build:images"]);


// task to watch on all changes
gulp.task("watch", ["browser-sync", "style"] ,function() {
    gulp.watch("src/scss/**/*.scss", ["style"]);
    gulp.watch("src/*.html", browserSync.reload)
});