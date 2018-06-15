import { AcTrieNode } from './AcTrieNode';

export const ROOT_INDEX = 1;

export type CharCode = number;
export type StateIdx = number;
export type StateIndexes = StateIdx[];

export interface RawAC {
    base: StateIndexes;
    check: StateIndexes;
    failurelink: StateIndexes;
    output: StateIndexes;
    codemap: StateIndexes;
}

export type CompactedAC = {
    [K in keyof RawAC]: Int32Array
}
export type ExportedAC = {
    [K in keyof RawAC]: string;
}

export interface AcState {
    state: AcTrieNode;
    index: number;
}
