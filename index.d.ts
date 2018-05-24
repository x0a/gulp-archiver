import { WriteStream } from "tty";
import { Transform } from "stream";
import { ZlibOptions } from "zlib";

/*
	Thanks to Esri <https://github.com/archiverjs/node-archiver>,
	Dolan Miu <https://github.com/dolanmiu>, and
	Crevil <https://github.com/crevil>

	For their ArchiverOptions typing.
	See the original at: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/archiver/index.d.ts

*/
declare class GulpArchiver {
	/**
	 * @param type Type of archive to create
	 * @param opts Options to pass to ArchiverJS
	 */
	
	constructor(format: GulpArchiver.ArchiveFormat, opts?: GulpArchiver.ArchiverOptions);
	/**
	 * @param path  Path within archive to place files
	 * @returns     A stream that receives Vinyl files and pushes them into the archive
	 */
	add(path?: string): Transform;
	/**
	 * @param fileOut File name for the created archive
	 * @returns     A readable stream containing only the created archive
	 */
	close(fileOut: string): ReadableStream;
	/**
	 * @param fileOut File name for the created archive. Archive format is determined using the file extension.
	 * @returns     A readable stream containing only the created archive
	 */
	static create(fileOut: string, opts?: GulpArchiver.ArchiverOptions): Transform;
}

declare namespace GulpArchiver{
	type ArchiveFormat = "zip" | "tar" | "tar.gz" | "tgz";
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

export = GulpArchiver;