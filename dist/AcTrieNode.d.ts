export declare class AcTrieNode {
    code: number;
    index: number;
    failurelink?: AcTrieNode;
    output?: AcTrieNode;
    pattern?: boolean;
    children: AcTrieNode[];
    readonly isRoot: boolean;
    readonly hasChildren: boolean;
    private base?;
    constructor(code: number, index: number);
    calcBase(parentIdxArray: number[]): number;
    setFailureLink(link: AcTrieNode): void;
    findFailureLink(code: number): AcTrieNode;
    private followFailure;
    findChildWithCode(code: number): AcTrieNode | undefined;
    findOrCreateWithCode(code: any): AcTrieNode;
}
