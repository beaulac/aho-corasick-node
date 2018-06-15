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
    private getOutputs;
    private getPattern;
    private getNextIndex;
    private getNextIndexByFailure;
    private getBase;
}
