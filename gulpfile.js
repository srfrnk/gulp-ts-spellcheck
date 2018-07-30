const gulp = require('gulp');
const tslint = require("gulp-tslint");
const ts = require('gulp-typescript');
const jest = require('gulp-jest').default;
const sourcemaps = require('gulp-sourcemaps');

gulp.task('tslint', (done) => {
    return gulp.src('src/**/*.ts')
        .on('error', function (err) {
            done(err);
        })
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
});

gulp.task('tsc', function (done) {
    var tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', function (err) {
            done(err);
        })
        .js
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('build'));
});

gulp.task('jest', (done) => {
    return gulp.src('')
        .on('error', function (err) {
            done(err);
        })
        .pipe(jest({}));
});

gulp.task('spellCheck', (done) => {
    const spellCheck = require('./build/index').default;
    return gulp.src('test/test-files/*.ts')
        .on('error', function (err) {
            done(err);
        })
        .pipe(spellCheck({}))
        .pipe(spellCheck.report({}));
});