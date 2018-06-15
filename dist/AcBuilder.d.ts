import { AhoCorasick } from './AhoCorasick';
export declare class AcBuilder {
    words: string[];
    private ac;
    private root;
    constructor(words?: string[]);
    add(word: string): void;
    build(): AhoCorasick;
    private buildDoubleArray();
    private buildAC();
    private buildBaseTrie();
    private addWordBuffer(wordBuffer);
}
