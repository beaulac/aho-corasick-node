export class TrieNode {
    public failurelink?: TrieNode;
    public pattern?: string | boolean;

    public children: TrieNode[] = [];

    public get isRoot() {
        return !this.code;
    }

    public get hasChildren() {
        return this.children.length > 0;
    }

    private base: number;

    constructor(public code?: any, public index?: number) {
    }

    /**
     * Find the minimum 'base' value such that
     * adding any child's code to the base
     * yields a unique state index.
     *
     * @param {number[]} existing
     * @return {number}
     */
    calcBase(existing: number[]) {
        let base = Math.max(0, this.index - this.children[0].code) + 1;

        while (this.children.some(c => !!existing[(base + c.code)])) {
            ++base;
        }

        return this.base = base;
    }

    findOrCreateWithCode(code: any) {
        let found = this.children.find(c => c.code === code);
        if (!found) {
            found = new TrieNode(code);
            this.children.push(found);
        }
        return found;
    }
}
