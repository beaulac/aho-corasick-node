export declare const ROOT_INDEX = 1;
export declare type CharCode = number;
export declare type StateIdx = number;
export declare type StateIndexes = StateIdx[];
declare type AcRepresentation = 'base' | 'check' | 'failurelink' | 'output' | 'codemap';
export declare type RawAC = {
    [K in AcRepresentation]: StateIndexes;
};
export declare type CompactedAC = {
    [K in AcRepresentation]: Int32Array;
};
export declare type ExportedAC = {
    [K in AcRepresentation]: string;
};
export {};
