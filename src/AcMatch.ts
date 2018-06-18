import { CharCode } from './AcCommon';
import { ab2str } from './utils';

export interface AcMatch {
    pattern: string;
    start: number;
    end: number;
}

export interface AcMatcher {
    match(text: string): AcMatch[];
}

export function buildMatch(matchBuf: CharCode[], endPos: number): AcMatch {
    const pattern = ab2str(matchBuf)
        , startPos = endPos - (pattern.length - 1);
    return {
        pattern: pattern,
        start: startPos,
        end: endPos,
    };
}

