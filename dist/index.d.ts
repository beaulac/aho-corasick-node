import { AcBuilder } from './AcBuilder';
import { AhoCorasick } from './AhoCorasick';
import { RawAC } from './AcCommon';
export * from './AcCommon';
export * from './AhoCorasick';
export declare function acBuilder(): AcBuilder;
export declare function from(buffers: RawAC): AhoCorasick;
