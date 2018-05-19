'use strict';

let path = require('path');
let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let File = gutil.File;
let through = require('through2');
let Archiver = require('archiver');
let fs = require('fs');
let concatStream = require("concat-stream")

let archiver = function(type, opts, taskEndCb){
	opts = opts || {};

	if(!type || ["zip", "tar", "tar.gz"].indexOf(type) === -1)
		throw new PluginError('gulp-archiver', 'Unsupported archive type for gulp-archiver');

	let archive = new Archiver(type, opts);
	let firstFile;

	this.add = dest => {
		//add file to pending, then if pending is 0, call triggerAdd()
		if (!dest) dest = "";
		dest += "/";

		return through.obj(function(file, encoding, callback){
			if(file.isStream()){
				this.emit('error', new PluginError('gulp-archiver',  'Streaming not supported'));
				callback();
				return;
			}
			
			if(!firstFile) firstFile = file;

			if(file.isDirectory()){
				archive.directory(file.path, {name: dest + file.relative});
			}else
				archive.append(file.contents, {name: dest + file.relative});

			if(taskEndCb)
				callback(null); //don't return file to stream, because we are going to replace it with the zip file
			else
				callback(null, file);
		}, function(callback){
			if(taskEndCb){
				taskEndCb.call(this, callback); //pass vinyl stream to task, along with the "done" callback
			}else
				callback();
		});
	}

	this.close = function(fileOut, vinyl)  {
		//writes directly to file, or returns vinyl stream.
		if(!fileOut) fileOut = "a.zip";

		return new Promise(resolve => {

			archive.finalize().then(() => {
				if(vinyl){
					archive.pipe(concatStream(data => {
						this.push(new File({
							cwd: firstFile.cwd,
							base: firstFile.base,
							path: path.join(firstFile.base, fileOut),
							contents: data
						}));

						resolve(this);
					}));
				}else{
					archive.pipe(fs.createWriteStream(fileOut));
					resolve();
				}
				
			});
		})
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
		throw new PluginError('gulp-archiver', 'Unsupported archive type for gulp-archiver');

	let archInst = new archiver(type, opts, function(done){
		//called from inst.add() upon task completion. 
		//here we close the archive, gather and push the vinyl stream, then call the task completion callback
		archInst.close.call(this, fileOut, true).then(vinyl => {
			done();
		});
	})

	return archInst.add();

}

module.exports = archiver;
