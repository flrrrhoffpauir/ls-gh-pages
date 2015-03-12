
var gulp 			= require('gulp'),
	plumber 		= require('gulp-plumber'),
	autoprefixer 	= require('gulp-autoprefixer'),
	cache 			= require('gulp-cached'),
	clean 			= require('gulp-clean'),
	filter 			= require('gulp-filter'),
	juice 			= require('./plugins/gulp-juice'),
	minify 			= require('gulp-minify-css'),
	newer			= require('gulp-newer'),
	rename 			= require('gulp-rename'),
	replace 		= require('gulp-replace'),
	sass 			= require('gulp-ruby-sass'),
	gutil 			= require('gulp-util');

var paths = {
	styles: 'src/sass/**/*.scss',
	templates: 'src/templates/**/*.html',
}

gulp.task('clean', function() {
	return gulp.src(['build/*', 'dev/*'], { read: false })
		.pipe(clean());
});

gulp.task('styles', function() {

	// prevent gulp watch from crashing
	// .on('error', function(err) { gutil.log(err.message); })

	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(newer('dev/css/'))
		.pipe(newer('build/css/'))
		.pipe(filter('!**/_*.scss'))
		// .pipe(cache('styles'))
		.pipe(sass({ style: 'nested' }))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    	.pipe(gulp.dest('build/css/')) // save non-min
		.pipe(gulp.dest('dev/css/'))
		.pipe(rename('main.min.css'))
		.pipe(minify())
		.pipe(gulp.dest('build/css/')) // save min
		.pipe(gulp.dest('dev/css/'))
});

gulp.task('html', ['html_build', 'html_dev'], function() {
});

gulp.task('html_build', ['styles'],function() {
	return gulp.src(paths.templates)
		.pipe(juice({ url: 'file://'+ __dirname + '/build/' }))
		.pipe(gulp.dest('build/templates/'))
});

gulp.task('html_dev', ['styles'], function() {
	return gulp.src(paths.templates)
		.pipe(newer('dev/templates/'))
		.pipe(replace('href="css', 'href="../css'))
		.pipe(gulp.dest('dev/templates/'))
});

gulp.task('watch', function() {
	gulp.watch([paths.templates, paths.styles], function() {
		gulp.start('html');
	});
});

gulp.task('default', function() {
	gulp.run('styles', 'html');
});

