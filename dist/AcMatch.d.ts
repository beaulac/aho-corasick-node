import { CharCode } from './AcCommon';
export interface AcMatch {
    pattern: string;
    start: number;
    end: number;
}
export interface AcMatcher {
    match(text: string): AcMatch[];
}
export declare function buildMatch(matchBuf: CharCode[], endPos: number): AcMatch;
