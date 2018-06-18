import { CompactedAC, ExportedAC, RawAC } from './AcCommon';

export function arrayToInt32Array(arr: number[]) {
    return Int32Array.from(arr);
}

export function int32ArrayToBase64(int32Array: Int32Array) {
    return Buffer.from(int32Array.buffer).toString('base64');
}

export function stringToBuffer(s: string): Int8Array {
    return new Int8Array(Buffer.from(s, 'utf8'));
}

export function exportAC(ac: CompactedAC): ExportedAC {
    return mapValues(ac, int32ArrayToBase64) as ExportedAC;
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

export function ab2str(codes: number[]): string {
    return String.fromCharCode.apply(null, codes);
}

export function str2ab(str: string): Int16Array {
    const strLen = str.length
        , buf = new ArrayBuffer(strLen * 2) // 2 bytes for each char
        , bufView = new Int16Array(buf);

    for (let i = 0; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }

    return bufView;
}
