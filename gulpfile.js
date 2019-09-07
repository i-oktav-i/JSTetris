const gulp = require("gulp");
const less = require("gulp-less");
const del = require("del");
const webpack = require('webpack-stream');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function html()
{
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream());
}

function styles() 
{
    return gulp.src('./src/less/*.less')
            .pipe(less())
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            }))
            .pipe(gulp.dest('./build/css'))
            .pipe(browserSync.stream());
}

function css() {
    return gulp.src('./src/css/*.css')
    .pipe(autoprefixer({
        browsers: ['> 0.1%'],
        cascade: false
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function js()
{
    return gulp.src('./src/js/index.js')
        .pipe(webpack({
            output: {
                filename: 'index.js'
            }
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
}


function delDist()
{
    return del(['build/*']);
}

function watch()
{
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        tunnel: true
    });

    gulp.watch('./src/*.html', html);
    gulp.watch('./src/css/**/*.css', css);
    gulp.watch('./src/js/**/*.js', js);
}

gulp.task('build', gulp.series(delDist, gulp.parallel(html, js, css)));
gulp.task('dev', gulp.series('build', watch));
gulp.task('watch', watch);