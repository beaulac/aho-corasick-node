import * as bytebuffer from 'bytebuffer';
import { CompactedAC, ExportedAC, RawAC } from './AcCommon';

export function arrayToInt32Array(arr: number[]) {
    return Int32Array.from(arr);
}

export function int32ArrayToHex(int32Array: Int32Array) {
    const b = bytebuffer.wrap(int32Array.buffer);
    return b.toHex();
}

export function hexToInt32Array(hex: string) {
    const b = bytebuffer.fromHex(hex);
    return new Int32Array(b.toArrayBuffer());
}

export function convert(codes: number[]) {
    const arr = Int8Array.from(codes);
    return bytebuffer.wrap(arr.buffer).toUTF8();
}

export function stringToBuffer(s: string): Int8Array {
    return new Int8Array(bytebuffer.fromUTF8(s).toBuffer());
}

export function exportAC(ac: CompactedAC): ExportedAC {
    return mapValues(ac, int32ArrayToHex) as ExportedAC;
}

export function compactAC(ac: RawAC): CompactedAC {
    return mapValues(ac, arrayToInt32Array) as CompactedAC;
}

function mapValues<T extends object, TResult>(obj: T,
                                              cb: (value: T[keyof T],
                                                   key: string,
                                                   collection: T) => TResult): { [P in keyof T]: TResult } {
    return (Object.keys(obj))
        .reduce((acc: any, k: string, _idx: number) => {
                    acc[k] = cb(obj[k as keyof T], k, obj);
                    return acc;
                },
                {} as { [P in keyof T]: TResult },
        );
}
