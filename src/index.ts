import { AcBuilder } from './AcBuilder';

export * from './AcCommon';
export * from './AhoCorasick';

export function acBuilder() {
    return new AcBuilder();
}
