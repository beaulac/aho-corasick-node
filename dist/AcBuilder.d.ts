import { AhoCorasick } from './AhoCorasick';
export declare class AcBuilder {
    words: string[];
    private ac;
    private root;
    constructor(words?: string[]);
    add(word: string): void;
    export(): import("../../../../../Users/abeaulac/projects/aho-corasick-node/src/AcCommon").CompactedAC;
    build(): AhoCorasick;
    private buildDoubleArray;
    private buildAC;
    private buildBaseTrie;
    private addWordBuffer;
}
