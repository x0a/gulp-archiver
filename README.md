# gulp-archiver
Archive anything through gulp

## Usage

```js
var gulp = require('gulp');
var Archiver = require('gulp-archiver');

gulp.task('default', function () {
	return gulp.src('src/**')
		.pipe(Archiver.create('archive.zip'))
		.pipe(gulp.dest('./dist'));
});
```
### For persistent use across tasks

```js
var gulp = require('gulp');
var Archiver = require('gulp-archiver');
var package = new Archiver("zip")

gulp.task("lib", () => {
	return gulp.src("lib/**")
	.pipe(package.add("lib/")) //add to lib/ folder inside zip
})

gulp.task("css", () => {
	return gulp.src("src/*.css")
	//.pipe(minifyCSS())
	.pipe(package.add())
})

gulp.task("js", () => {
	return gulp.src("src/*.js")
	//.pipe(minifyJS())
	.pipe(package.add())
})

gulp.task("img", () => {
    return gulp.src("media/**")
    //.pipe(compressJPG())
    .pipe(package.add("resources/img/"))
});

gulp.task("done", (cb) => {
    package.close("dist/out.zip").then(cb);
});

//Runs css, js, and HTML tasks in series, then runs "done"
gulp.task('default', gulp.series(gulp.parallel("lib", "css", "js", "img"), "done"));
```

Plugin uses [archiver](https://www.npmjs.org/package/archiver) npm package to make archive. 

## API

### new archiver(type[, options])

#### type

*Required*
Type: `String`

File extension is used to define archive type. Plugin supports only `zip` and `tar` archives.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository


### archive.add(dest)

#### dest

Type: `String`

Destination within compressed file. If left empty, files will be placed at the root of the file.

### archive.close(filename)

#### filename

Type: `String`

Filename to output file to.
