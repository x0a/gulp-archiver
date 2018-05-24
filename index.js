"use strict";

let path = require("path");
let through = require("through2");
let concatStream = require("concat-stream");
let Archiver = require("archiver");
let PluginError = require("plugin-error");
let Vinyl = require("vinyl");

let GulpArchiver = function (format, opts) {
	let supported = ["zip", "tar", "tar.gz", "tgz"];
	let found = -1;

	if (!format || (found = supported.indexOf(format)) === -1)
		throw new PluginError("gulp-archiver2", "Unsupported archive format");

	//If they want a compressed tarball, the archiver considers that a regular tarball.. with compression added
	if(found > 1){
		format = "tar";
		opts.gzip = true;
	}

	opts = opts || {};

	let archive = new Archiver(format, opts);
	let firstFile;
	let self = this;

	let close = function (cb) {
		if(!firstFile) return cb();

		archive.finalize().then(() =>
			archive.pipe(concatStream(data => {
				//add our new archive to the stream
				this.push(new Vinyl({
					cwd: firstFile.cwd,
					base: firstFile.base,
					path: path.join(firstFile.base, self.fileOut),
					contents: data
				}))

				cb();
			}))
		);
	}

	this.add = (dest, closeAfter) => {
		//add file to pending, then if pending is 0, call triggerAdd()
		if (!dest) dest = "";
		dest = path.join(dest, "/")

		return through.obj(function (file, encoding, cb) {
			if (file.isStream()) {
				this.emit("error", new PluginError("gulp-archiver2", "Streaming not supported"));
				cb();
				return;
			}

			if (!firstFile) firstFile = file;

			if (file.isDirectory())
				archive.append(null, { name: path.join(dest, file.relative), type: "directory" })
			else
				archive.append(file.contents, { name: path.join(dest, file.relative) });

			if (closeAfter)
				cb(null); //don't return file to stream, because we are going to replace it with the archive
			else
				cb(null, file);
		}, function (cb) {
			if (closeAfter)
				close.call(this, cb);
			else
				cb();
		});
	}

	this.close = function (fileOut) {
		if (!fileOut)
			throw new PluginError("gulp-archiver2", "Missing argument or invalid filename");
		this.fileOut = fileOut;

		let passthru = through.obj(); //simple pass-through stream

		close.call(passthru, () => { //add archive to stream
			passthru.push(null); //send EOF to signal stream finished
		})

		return passthru;
	}

	return this;
}

GulpArchiver.create = function (fileOut, opts) {
	//this is a static method that acts as wrapper for the class above
	//creates instance, exposes this.add, closes after task completion
	let matches, format;

	if (typeof fileOut === "string" && (matches = fileOut.match(/\.(zip|tar|tar\.gz|tgz)$/)))
		format = matches[1] || matches[2];
	else
		throw new PluginError("gulp-archiver2", "Unsupported archive format for gulp-archiver");

	let archInst = new GulpArchiver(format, opts);

	archInst.fileOut = fileOut;

	return archInst.add(null, true);

}

module.exports = GulpArchiver;
