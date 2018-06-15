import * as bytebuffer from 'bytebuffer';
import * as _ from 'lodash';
import { ExportedAC} from './AcCommon';
import { CompactedAC, RawAC } from './AcCommon';

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
    return _.mapValues(ac, int32ArrayToHex) as ExportedAC;
}

export function compactAC(ac: RawAC): CompactedAC {
    return _.mapValues(ac, arrayToInt32Array) as CompactedAC;
}
