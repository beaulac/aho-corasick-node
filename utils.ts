import * as bytebuffer from 'bytebuffer';
import * as _ from 'lodash';

export function arrayToInt32Array(arr) {
    const int32Array = new Int32Array(arr.length);
    _.forEach(arr, (v, i) => {
        int32Array[i] = v;
    });
    return int32Array;
}

export function int32ArrayToHex(int32Array) {
    const b = bytebuffer.wrap(int32Array.buffer);
    return b.toHex();
}

export function hexToInt32Array(hex) {
    const b = bytebuffer.fromHex(hex);
    return new Int32Array(b.toArrayBuffer());
}


export function convert(codes) {
    const arr = Int8Array.from(codes);
    return bytebuffer.wrap(arr.buffer).toUTF8();
}

export function stringToBuffer(s: string): Int8Array {
    return new Int8Array(bytebuffer.fromUTF8(s).toBuffer());
}
