import { CompactedAC, ExportedAC, RawAC } from './AcCommon';
export declare function arrayToInt32Array(arr: number[]): Int32Array;
export declare function int32ArrayToBase64(int32Array: Int32Array): string;
export declare function stringToBuffer(s: string): Int8Array;
export declare function exportAC(ac: CompactedAC): ExportedAC;
export declare function compactAC(ac: RawAC): CompactedAC;
export declare function ab2str(codes: number[]): string;
export declare function str2ab(str: string): Int16Array;
