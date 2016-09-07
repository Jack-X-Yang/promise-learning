const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');

gulp.task('default', function() {
    gulp.watch(['src/**/*.js', 'spec/**/*.js'], ['test']);
});

gulp.task('test', function() {
    gulp.src('spec/**/*.js')
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter()
        }));
});
