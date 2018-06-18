export const ROOT_INDEX = 1;

export type CharCode = number;
export type StateIdx = number;
export type StateIndexes = StateIdx[];

type AcRepresentation = 'base' | 'check' | 'failurelink' | 'output' | 'codemap';

export type RawAC = {
    [K in AcRepresentation]: StateIndexes;
}

export type CompactedAC = {
    [K in AcRepresentation]: Int32Array
}
export type ExportedAC = {
    [K in AcRepresentation]: string;
}
