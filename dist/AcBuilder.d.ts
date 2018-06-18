import { CompactedAC } from './AcCommon';
import { AcMatcher } from './AcMatch';
export declare class AcBuilder {
    words: string[];
    private ac;
    private root;
    constructor(words?: string[]);
    add(word: string): void;
    export(): CompactedAC;
    build(): AcMatcher;
    private buildDoubleArray;
    private buildAC;
    private buildBaseTrie;
    private addWordBuffer;
}
