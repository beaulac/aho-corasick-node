import { AcBuilder } from './AcBuilder';
import { AhoCorasick } from './AhoCorasick';
import { RawAC } from './AcCommon';
import { compactAC } from './utils';
import { AcMatcher } from './AcMatch';

export * from './AcCommon';

export { AcMatch, AcMatcher } from './AcMatch';

export function acBuilder() {
    return new AcBuilder();
}

export function from(buffers: RawAC): AcMatcher {
    return new AhoCorasick(compactAC(buffers));
}
