"use strict";

let path = require("path");
let through = require("through2");
let fs = require("fs");
let concatStream = require("concat-stream");
let Archiver = require("archiver");
let PluginError = require("plugin-error");
let Vinyl = require("vinyl");

let archiver = function(type, opts){
	opts = opts || {};

	if(!type || ["zip", "tar", "tar.gz"].indexOf(type) === -1)
		throw new PluginError("gulp-archiver", "Unsupported archive type for gulp-archiver");

	let archive = new Archiver(type, opts);
	let firstFile;
	let self = this;

	let close = function(cb){
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

		return through.obj(function(file, encoding, cb){
			if(file.isStream()){
				this.emit("error", new PluginError("gulp-archiver",  "Streaming not supported"));
				cb();
				return;
			}
			
			if(!firstFile) firstFile = file;

			if(file.isDirectory())
				archive.append(null, {name: path.join(dest, file.relative), type: "directory"})
			else
				archive.append(file.contents, {name: path.join(dest, file.relative)});

			if(closeAfter)
				cb(null); //don't return file to stream, because we are going to replace it with the archive
			else
				cb(null, file);
		}, function(cb){
			if(closeAfter)
				close.call(this, cb);
			else
				cb();
		});
	}

	this.close = function(fileOut){
		if(!fileOut) 
			throw new PluginError("gulp-archiver", "Missing argument or invalid filename");
		this.fileOut = fileOut;

		let passthru = through.obj(); //simple pass-through stream

		passthru.pause(); //give us time to add the file

		close.call(passthru, () => { //add archive to stream
			passthru.push(null); //send EOF to signal stream finished
		})

		return passthru;
	}

	return this;
}

archiver.create = function(fileOut, opts){
	//this is a static method that acts as wrapper for the class above
	//creates instance, exposes this.add, closes after task completion
	let matches, type;

	if(typeof fileOut === "string" && (matches = fileOut.match(/\.(zip|tar)$|\.(tar).gz$/)))
		type = matches[1] || matches[2];
	else
		throw new PluginError("gulp-archiver", "Unsupported archive type for gulp-archiver");

	let archInst = new archiver(type, opts);
	archInst.fileOut = fileOut;
	return archInst.add(null, true);

}

module.exports = archiver;
