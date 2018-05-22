# gulp-archiver2
Archive anything through gulp. Based on [gulp-archiver](https://github.com/fobos/gulp-archiver), with the added ability to use archives persistent across tasks.

## Usage

```js
var gulp = require('gulp');
var Archiver = require('gulp-archiver2');

gulp.task('default', function () {
	return gulp.src('src/**')
		.pipe(Archiver.create('archive.zip'))
		.pipe(gulp.dest('./dist'));
});
```
### For persistent use across tasks

```js
var gulp = require('gulp');
var Archiver = require('gulp-archiver2');
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
		.pipe(archive.add()) 
})

gulp.task("img", () => {
	return gulp.src("media/**")
		.pipe(archive.add("resources/img/")) 
});

gulp.task("done", () => {
	return archive.close("out.zip")
		.pipe(gulp.dest("dist/"))
});

// Can handle files being added simultanously through parallel tasks
gulp.task('default', 
	gulp.series(
		gulp.parallel("lib", "css", "js", "img"), 
		"done")
);
```

Plugin uses [archiver](https://www.npmjs.org/package/archiver) npm package to make archive. 

## API

### `archiver.create(fileOut[, options])`

Takes files and produces a single archive.

#### fileOut

*Required*
Type: `String`

File name for the resulting archive. Plugin supports only `zip` and `tar` archives.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository

<hr/>

### let instance = `new archiver(type[, options])`

Creates a persistent archive that can be used across tasks

#### type

*Required*
Type: `String`

File extension is used to define archive type. Plugin supports only `zip` and `tar` archives.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository


### instance`.add([dest])`

Accepts files/folders and adds them to the archive

#### dest

Type: `String`

Destination within the archive. If left empty, files will be placed at the root of the file.

### instance`.close(filename)`

Closes archive and returns a Readable, which can be piped to `gulp.dest`

#### filename

*Required*
Type: `String`

Filename to output file to.
