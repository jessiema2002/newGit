var gulp = require('gulp');
var config = require('./config');
var plugins = require('../../' + config.plugins);
var buildDir = 'target';
var del = require('del');
var inject = require('gulp-inject');
var series = require('stream-series');

gulp.task('clean', function () {
    return del(buildDir);
});

// copy symphony resource
gulp.task('copy-symphony', ['clean'], function(){
    return gulp.src('./symphony.zip')
        .pipe(plugins.decompress())
        .pipe(gulp.dest(buildDir));
});

// process and copy app resource
gulp.task('copy-app', ['clean'], function(){

    var filter = plugins.filter(['*', '**/*.htm'], {restore: true});
    var currentdate = new Date();
    var timestamp = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    var copyApp = gulp.src(['./**/*', '!gulpfile.js', '!symphony.zip'])
        .pipe(plugins.chmod(777))
        .pipe(filter)
        .pipe(plugins.replace('$$buildtime$$', timestamp))
        .pipe(filter.restore)
        .pipe(gulp.dest(buildDir));

    return copyApp;
});

// inject symphony component js and css into index.html
gulp.task('inject', ['copy-symphony'], function(){
    var streams = [];
    for (var componentName in config.components) {
        var js_stream = gulp.src(plugins.path.join(buildDir, '/js/' + 'symphony-' + componentName + '.js'), {read: false});
        var css_stream = gulp.src(plugins.path.join(buildDir, '/css/' + 'symphony-' + componentName + '.css'), {read: false});
        streams.push(js_stream);
        streams.push(css_stream);
    }
    return gulp.src(plugins.path.join(buildDir, '/index.html'))
        .pipe(inject(series(streams), {relative: true}))
        .pipe(gulp.dest(buildDir));
});

gulp.task('serve', ['clean', 'copy-app', 'copy-symphony', 'inject'], function() {
    plugins.browserSync.init({
        server: {
            baseDir: "./" + buildDir,
            index: "index.html"
        }
    });

    gulp.watch('./res/**/*', function (obj) {
        if (obj.type === 'changed') {
            gulp.src(obj.path, {"base": "./"})
                .pipe(gulp.dest(buildDir));
            plugins.browserSync.reload();
        }
    });

    /*gulp.watch('./index.html', function (obj) {
        if (obj.type === 'changed') {
            gulp.src(obj.path, {"base": "./"})
                .pipe(gulp.dest(buildDir));
            inject();
        }
    });*/
});
