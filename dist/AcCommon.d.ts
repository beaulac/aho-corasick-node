import { AcTrieNode } from './AcTrieNode';
export declare const ROOT_INDEX = 1;
export declare type CharCode = number;
export declare type StateIdx = number;
export declare type StateIndexes = StateIdx[];
export interface RawAC {
    base: StateIndexes;
    check: StateIndexes;
    failurelink: StateIndexes;
    output: StateIndexes;
    codemap: StateIndexes;
}
export declare type CompactedAC = {
    [K in keyof RawAC]: Int32Array;
};
export declare type ExportedAC = {
    [K in keyof RawAC]: string;
};
export interface AcState {
    state: AcTrieNode;
    index: number;
}
