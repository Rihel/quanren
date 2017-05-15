const gulp = require('gulp'),
	  clean = require('gulp-clean'),
	  htmlmin = require('gulp-htmlmin'),
	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  minifycss = require('gulp-clean-css'),
	  babel = require('gulp-babel'),
	  uglify = require('gulp-uglify'),
	  imagemin = require('gulp-imagemin'),
	  pngquant = require('imagemin-pngquant'),
	  cache = require('gulp-cache'),
	  notify = require('gulp-notify');


const path = {
	root: 'src/',
	dist: 'dist/',
	scss: 'src/scss/*.scss',
	es6: 'src/es6/**/*.js',
	img: 'src/img/**/*.{jpg,gif,png,ico}',
	html: 'src/**/*.html',
	copy:'src/css/**/*.{otf,eot,svg,ttf,woff,woff2}'
}
// css


gulp.task('css', () => {
	return gulp.src(path.scss)
			   .pipe(sass())
			   .pipe(gulp.dest(path.root + 'css'))
			   .pipe(autoprefixer({
				   browsers: ['last 2 versions', '>1%', 'IOS 7'],
				   remove:false

			   }))
			   .pipe(gulp.dest(path.root + 'css'))
			   .pipe(minifycss())
			   .pipe(gulp.dest(path.dist + 'css'))
			   .pipe(notify({ message: 'css样式编译压缩完毕' }))
});

// gulp.task('js', () => {
// 	return gulp.src(path.es6)
// 			   .pipe(babel({
// 				   presets: ['es2015']
// 			   }))
// 			   .pipe(gulp.dest(path.root + 'js'))
// 			   .pipe(uglify({
// 				   mangle: false
// 			   }))
// 			   .pipe(gulp.dest(path.dist + 'js'))
// 			   .pipe(notify({ message: 'js编译压缩完毕' }))
// })
gulp.task('copy', () => {
	return gulp.src(path.copy)

			   .pipe(gulp.dest(path.dist + 'css/'))
			   .pipe(notify({ message: '字体压缩完毕' }));
})
gulp.task('img', () => {
	return gulp.src(path.img)
			   .pipe(imagemin({
				   progressive: true,
				   svgoPlugins: [{ removeViewBox: false }],
				   use: [pngquant()]
			   }))
			   .pipe(gulp.dest(path.dist + 'img'))
			   .pipe(notify({ message: '图片压缩完毕' }));
})
gulp.task('html', () => {
	return gulp.src(path.html)
			   .pipe(htmlmin({
				   removeComments: true,
				   collapseWhitespace: true,
				   collapseBooleanAttributes: true,
				   removeEmptyAttributes: true,
				   removeScriptTypeAttributes: true,
				   removeStyleLinkTypeAttributes: true,
				   minifyJS: true,
				   minifyCSS: true
			   }))
			   .pipe(gulp.dest(path.dist))
			   .pipe(notify({ message: 'html文件压缩完毕' }))
});
gulp.task('clean', () => {
	return gulp.src(path.dist, { read: false })
			   .pipe(clean());
})
gulp.task('default', ['clean'], () => {
	gulp.start(['css',  'copy','img', 'html'])
})
gulp.task('watch', () => {
	gulp.watch(path.scss, ['css']);
	// gulp.watch(path.es6, ['js']);
	gulp.watch(path.img, ['img']);
	gulp.watch(path.html, ['html']);
})