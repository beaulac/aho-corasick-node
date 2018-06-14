import * as _ from 'lodash';
import { AhoCorasick } from './AhoCorasick';
import { arrayToInt32Array, stringToBuffer } from './utils';
import { TrieNode } from './TrieNode';

const ROOT_INDEX = 1;

type WordBuffer = Array<number>;

export interface RawAC {
    base: WordBuffer;
    check: WordBuffer;
    failurelink: WordBuffer;
    output: WordBuffer;
    codemap: WordBuffer;
}

export type CompactedAC = {
    [K in keyof RawAC]: Int32Array
}

export type ExportedAC = {
    [K in keyof RawAC]: string;
}

export interface AcState {
    state: TrieNode;
    index: number;
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

function findFailureLink(currentState: TrieNode, code: ArrayBuffer) {
    const link = currentState.failurelink;
    const index = _.findIndex(link.children, child => child.code === code);
    if (index >= 0) {
        return link.children[index];
    }
    if (link.isRoot) {
        return link;
    }
    return findFailureLink(link, code);
}


function compactAC(ac: RawAC): CompactedAC {
    return _.mapValues(ac, arrayToInt32Array) as CompactedAC;
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
        this.buildDoubleArray(ROOT_INDEX, baseTrie);
        this.buildAC();
        return new AhoCorasick(compactAC(this.ac));
    }

    private buildDoubleArray(rootIndex, baseTrie) {
        const stack = [{ state: baseTrie, index: rootIndex }];
        while (!_.isEmpty(stack)) {
            const { state, index } = stack.pop();
            state.index = index;
            if (state.code) {
                this.ac.codemap[index] = state.code;
            }
            if (!_.isEmpty(state.children)) {
                const v = calcBase(this.ac, index, state.children);
                if (state.pattern) {
                    this.ac.base[index] = -v;
                } else {
                    this.ac.base[index] = v;
                }
                // set check
                _.forEach(state.children, (child) => {
                    const nextState = v + child.code;
                    this.ac.check[nextState] = index;
                    stack.push({ state: child, index: nextState });
                });
            }
        }
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
        const lastCharacterNode = wordBuffer.reduce(
            (node: TrieNode, charCode: number) => node.findOrCreateWithCode(charCode),
            this.root,
        );
        lastCharacterNode.pattern = true;
    }
}
