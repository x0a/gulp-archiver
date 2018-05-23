import { WriteStream } from "tty";
import { Transform } from "stream";

declare class Archiver{
    constructor(type: string, opts?: object);
    /*** Push files to archive */
    add(path: string): Transform;
    /*** Close archive */
    close(fileOut: string): ReadableStream;
    static create(fileOut: string, opts?: object): Transform;
}

export = Archiver;