import { WriteStream } from "tty";
import { Transform } from "stream";
/*
	Thanks to Esri <https://github.com/archiverjs/node-archiver>,
	Dolan Miu <https://github.com/dolanmiu>, and
	Crevil <https://github.com/crevil>

	For their ArchiverOptions typing.
	See the original at: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/archiver/index.d.ts

*/
declare class Archiver {
	/**
	 * @param type Type of archive to create
	 * @param opts Options to pass to ArchiverJS
	 */
	
	constructor(type: Archiver.ArchiveType, opts?: Archiver.ArchiverOptions);
	/**
	 * @param path  Path within archive to place files
	 * @returns     A stream that receives Vinyl files and pushes them into the archive
	 */
	add(path: string): Transform;
	/**
	 * @param filename File name for the created archive
	 * @returns     A readable stream containing only the created archive
	 */
	close(filename: string): ReadableStream;
	/**
	 * @param filename File name for the created archive. Archive type is determined using the extension.
	 * @returns     A readable stream containing only the created archive
	 */
	static create(filename: string, opts?: Archiver.ArchiverOptions): Transform;
}

declare namespace Archiver{
	type ArchiveType = "zip" | "tar" | "tar.gz";
    type ArchiverOptions = CoreOptions & TransformOptions & ZipOptions & TarOptions;

    interface CoreOptions {
        statConcurrency?: number;
    }

    interface TransformOptions {
        allowHalfOpen?: boolean;
        readableObjectMode?: boolean;
        writeableObjectMode?: boolean;
        decodeStrings?: boolean;
        encoding?: string;
        highWaterMark?: number;
        objectmode?: boolean;
    }

    interface ZipOptions {
        comment?: string;
        forceLocalTime?: boolean;
        forceZip64?: boolean;
        store?: boolean;
        zlib?: ZlibOptions;
    }

    interface TarOptions {
        gzip?: boolean;
        gzipOptions?: ZlibOptions;
    }
}

export = Archiver;