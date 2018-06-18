import { CompactedAC } from './AcCommon';
import { AcMatch, AcMatcher } from './AcMatch';
export declare class AhoCorasick implements AcMatcher {
    private data;
    private currentState;
    constructor(data: CompactedAC);
    match(text: string): AcMatch[];
    private getOutputs;
    private getPattern;
    private getNextIndex;
    private getNextIndexByFailure;
    private getBase;
}
