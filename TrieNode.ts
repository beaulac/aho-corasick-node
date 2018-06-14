export class TrieNode {
    public failurelink?: TrieNode;
    public pattern?: string | boolean;
    public index?: number;

    public children: TrieNode[] = [];

    public get isRoot() {
        return !this.code;
    }

    constructor(public code?: any) {
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
