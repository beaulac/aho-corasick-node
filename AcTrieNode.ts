export class AcTrieNode {

    public failurelink?: AcTrieNode;
    public output?: AcTrieNode;

    /**
     * Is this node the final character of a keyword?
     */
    public pattern?: boolean;

    public children: AcTrieNode[] = [];

    public get isRoot() {
        return !this.code;
    }

    public get hasChildren() {
        return this.children.length > 0;
    }

    private base: number;

    constructor(public code?: number,
                public index?: number) {
    }

    /**
     * Find the minimum 'base' value such that
     * adding any child's code to the base
     * yields a unique state index.
     *
     * @param {number[]} parentIdxArray
     * @return {number}
     */
    calcBase(parentIdxArray: number[]) {
        let base = Math.max(0, this.index - this.children[0].code) + 1;

        while (this.children.some(c => !!parentIdxArray[(base + c.code)])) {
            ++base;
        }

        return this.base = base;
    }

    setFailureLink(link: AcTrieNode) {
        this.failurelink = link;
        this.output = link.pattern ? link : link.output;
    }

    findFailureLink(code: number) {
        return this.failurelink.followFailure(code);
    }

    private followFailure(code: number): AcTrieNode {
        const childWithCode = this.findChildWithCode(code);
        if (childWithCode) {
            return childWithCode;
        }
        if (this.isRoot) {
            return this;
        }
        return this.findFailureLink(code);
    }

    findChildWithCode(code: number): AcTrieNode {
        return this.children.find(c => c.code === code);
    }

    findOrCreateWithCode(code: any) {
        let found = this.findChildWithCode(code);
        if (!found) {
            found = new AcTrieNode(code);
            this.children.push(found);
        }
        return found;
    }
}
