import { AcBuilder } from './AcBuilder';
import { AhoCorasick } from './AhoCorasick';
import { RawAC } from './AcCommon';
import { compactAC } from './utils';

export * from './AcCommon';
export * from './AhoCorasick';

export function acBuilder() {
    return new AcBuilder();
}

export function from(buffers: RawAC) {
    return new AhoCorasick(compactAC(buffers));
}
