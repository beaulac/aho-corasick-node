export class AcTrieNode {
    public failurelink?: AcTrieNode;
    public pattern?: string | boolean;

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

    findFailureLink(code: number) {
        const link = this.failurelink;

        const linkChildWithCode = link.findChildWithCode(code);
        if (linkChildWithCode) {
            return linkChildWithCode;
        }
        if (link.isRoot) {
            return link;
        }
        return link.findFailureLink(code);
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
