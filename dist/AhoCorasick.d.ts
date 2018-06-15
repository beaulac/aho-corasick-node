import { CompactedAC } from './AcCommon';
export interface AcMatch {
    pattern: string;
    start: number;
    end: number;
}
export declare class AhoCorasick {
    data: CompactedAC;
    private currentState;
    constructor(data: CompactedAC);
    match(text: string): AcMatch[];
    private getOutputs(index);
    private getPattern(index);
    private getNextIndex(code);
    private getNextIndexByFailure(ac, currentIndex, code);
    private getBase(index);
}
