import { CompactedAC, ExportedAC, RawAC } from './AcCommon';

export function arrayToInt32Array(arr: number[]) {
    return Int32Array.from(arr);
}

export function int32ArrayToBase64(int32Array: Int32Array) {
    return Buffer.from(int32Array.buffer).toString('base64');
}

export function convert(codes: number[]) {
    return Buffer.from(codes).toString('utf8');
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
