import * as bytebuffer from 'bytebuffer';

export function arrayToInt32Array(arr) {
    return Int32Array.from(arr);
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
