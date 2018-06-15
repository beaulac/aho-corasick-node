import { CompactedAC, ExportedAC, RawAC } from './AcCommon';
export declare function arrayToInt32Array(arr: number[]): Int32Array;
export declare function int32ArrayToBase64(int32Array: Int32Array): string;
export declare function stringToBuffer(s: string): Int8Array;
export declare function exportAC(ac: CompactedAC): ExportedAC;
export declare function compactAC(ac: RawAC): CompactedAC;
