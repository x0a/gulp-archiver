# gulp-archiver2
Archive anything through gulp. Based on [gulp-archiver](https://www.npmjs.com/package/gulp-archiver), with the added ability to use archives persistently across tasks.

Thanks to @Fobos for his work on the original [gulp-archiver](https://github.com/fobos/gulp-archiver)

## Usage

```js
let gulp = require('gulp');
let Archiver = require('gulp-archiver2');

gulp.task('default', function () {
  return gulp.src('src/**')
    .pipe(Archiver.create('archive.zip'))
    .pipe(gulp.dest('./dist'));
});
```
### For persistent use across tasks

```js
let gulp = require('gulp');
let Archiver = require('gulp-archiver2');
let archive = new Archiver("zip")


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
    "done"
  )
);
```

Plugin uses [archiver](https://www.npmjs.org/package/archiver) npm package to make archive. 

## API

### `Archiver.create(fileOut[, options])`

Consumes files and pushes an archive to the stream

#### fileOut

*Required*
Type: `String`

File name for the resulting archive. Must end with file extension indicating the format. Plugin supports only `zip`, `tar`, and `tar.gz` archives.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository

<hr/>

### let instance = `new Archiver(format[, options])`

Creates a persistent archive that can be used across tasks

#### format

*Required*
Type: `String`

Type of archive to create. Can be `"zip"`, `"tar"`, `"tar.gz"`, or `"tgz"`.

#### options

Type: `Object`

Described in original [archiver](https://github.com/archiverjs/node-archiver#zip) repository


### instance`.add([path])`

Accepts files/folders and adds them to the archive

#### path

Type: `String`

Destination within the archive to place files. If left empty, files will be placed at the root of the file.

### instance`.close(fileOut)`

Closes archive and returns a Readable, which can be piped to `gulp.dest`

#### fileOut

*Required*
Type: `String`

Filename to output file to.
