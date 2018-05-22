# gulp-archiver
Archive anything through gulp. 

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
var archive = new Archiver("zip")



gulp.task("css", () => {
	return gulp.src("src/*.css")
	.pipe(archive.add()) //add to the root of the zip
})

gulp.task("lib", () => {
	return gulp.src("lib/**")
	.pipe(archive.add("lib/")) //add to lib/ folder inside zip
})

gulp.task("js", () => {
	return gulp.src("src/*.js")
	.pipe(archive.add()) //add to root
})

gulp.task("img", () => {
    return gulp.src("media/**")
    .pipe(archive.add("resources/img/")) 
});

gulp.task("done", (cb) => {
	archive.close("out.zip")
	.pipe(gulp.dest("dist/"))
});

//Runs css, js, and HTML tasks in series, then runs "done"
gulp.task('default', gulp.series(gulp.parallel("lib", "css", "js", "img"), "done"));
```

Plugin uses [archiver](https://www.npmjs.org/package/archiver) npm package to make archive. 

## API

### `archiver.create(fileOut[, options])

Collects files, pushes them to a new archive, then outputs a single archive to the stream, which can then be piped to `gulp.dest`

### `new archiver(type[, options])`

Creates a persistent archive that can be used across tasks

#### type

*Required*
Type: `String`

File extension is used to define archive type. Plugin supports only `zip` and `tar` archives.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository


### `archive.add(dest)`

Accepts files/folders and adds them to the archive

#### dest

Type: `String`

Destination within compressed file. If left empty, files will be placed at the root of the file.

### `archive.close(filename)`

Closes archive and returns a Readable, which can be piped to `gulp.dest`

#### filename

Type: `String`

Filename to output file to.
