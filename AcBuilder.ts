import * as _ from 'lodash';
import { AhoCorasick } from './AhoCorasick';
import { arrayToInt32Array, stringToBuffer } from './utils';

const ROOT_INDEX = 1;

export interface RawAC {
    base: Int32Array;
    check: Int32Array;
    failurelink: Int32Array;
    output: Int32Array;
    codemap: Int32Array;
}

export type ExportedAC = {
    [K in keyof RawAC]: string;
}

function calcBase(da, index, children) {
    let base = 1;
    if (index - children[0].code > base) {
        base = (index - children[0].code) + 1;
    }
    for (; ;) {
        let used = false;
        for (let i = 0; i < children.length; i++) {
            const nextState = base + children[i].code;
            if (da.check[nextState]) {
                used = true;
                break;
            }
        }
        if (used) {
            base += 1;
        } else {
            break;
        }
    }
    return base;
}

const isRoot = baseTrie => !baseTrie.code;

function findFailureLink(currentState: TrieNode, code: ArrayBuffer) {
    const link = currentState.failurelink;
    const index = _.findIndex(link.children, child => child.code === code);
    if (index >= 0) {
        return link.children[index];
    }
    if (isRoot(link)) {
        return link;
    }
    return findFailureLink(link, code);
}

function buildDoubleArray(rootIndex, baseTrie, doubleArray) {
    const stack = [{ state: baseTrie, index: rootIndex }];
    while (!_.isEmpty(stack)) {
        const { state, index } = stack.pop();
        state.index = index;
        if (state.code) {
            doubleArray.codemap[index] = state.code;
        }
        if (!_.isEmpty(state.children)) {
            const v = calcBase(doubleArray, index, state.children);
            if (state.pattern) {
                doubleArray.base[index] = -v;
            } else {
                doubleArray.base[index] = v;
            }
            // set check
            _.forEach(state.children, (child) => {
                const nextState = v + child.code;
                doubleArray.check[nextState] = index;
                stack.push({ state: child, index: nextState });
            });
        }
    }
}

function compactAC(ac) {
    return ({
        base: arrayToInt32Array(ac.base),
        check: arrayToInt32Array(ac.check),
        failurelink: arrayToInt32Array(ac.failurelink),
        output: arrayToInt32Array(ac.output),
        codemap: arrayToInt32Array(ac.codemap),
    });
}

class TrieNode {
    failurelink?: TrieNode;
    pattern?: string | boolean;
    index?: number;

    public children: ChildNode[] = [];

    findOrCreateWithCode(code: any) {
        let found = this.children.find(c => c.code === code);
        if (!found) {
            found = new ChildNode(code);
            this.children.push(found);
        }
        return found;
    }

}

class ChildNode extends TrieNode {
    constructor(public code: any) {
        super();
    }
}

export class Builder {

    words: string[] = [];

    private ac = {
        base: [],
        check: [],
        failurelink: [],
        output: [],
        codemap: [],
    };

    private root = new TrieNode();

    constructor() {
    }

    add(word: string) {
        this.words.push(word);
    }

    build() {
        const baseTrie = this.buildBaseTrie();
        buildDoubleArray(ROOT_INDEX, baseTrie, this.ac);
        this.buildAC();
        return new AhoCorasick(compactAC(this.ac));
    }

    private buildAC() {
        const baseTrie = this.buildBaseTrie();

        const queue = [];
        _.forEach(baseTrie.children, (child) => {
            child.failurelink = baseTrie;
            this.ac.failurelink[child.index] = baseTrie.index;
            queue.push(child);
        });

        let i = 0;
        while (i < queue.length) {
            const current = queue[i];
            i += 1;
            _.forEach(current.children, (child) => {
                // build failurelink
                const failurelink = findFailureLink(current, child.code);
                child.failurelink = failurelink;
                this.ac.failurelink[child.index] = failurelink.index;
                queue.push(child);

                // build output link
                if (failurelink.pattern) {
                    child.output = failurelink;
                } else {
                    child.output = failurelink.output;
                }
                if (child.output) {
                    this.ac.output[child.index] = child.output.index;
                }
            });
        }
    }

    private buildBaseTrie(): TrieNode {
        const sortedKeys: Array<Int8Array> = this.words.map(stringToBuffer).sort();

        _.forEach(sortedKeys, wb => this.addWordBuffer(wb));

        return this.root;
    }

    private addWordBuffer(wordBuffer: Int8Array) {
        _.reduce(wordBuffer,
                 (node: TrieNode, code: number, pos: number) => {
                     const current = node.findOrCreateWithCode(code);
                     if (pos === wordBuffer.byteLength - 1) {
                         current.pattern = true;
                     }
                     return current;
                 },
                 this.root,
        );
    }
}
