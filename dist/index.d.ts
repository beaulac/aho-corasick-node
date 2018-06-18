import { AcBuilder } from './AcBuilder';
import { RawAC } from './AcCommon';
import { AcMatcher } from './AcMatch';
export * from './AcCommon';
export { AcMatch, AcMatcher } from './AcMatch';
export declare function acBuilder(): AcBuilder;
export declare function from(buffers: RawAC): AcMatcher;
