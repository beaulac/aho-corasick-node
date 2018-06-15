import * as _ from 'lodash';
import { AhoCorasick } from './AhoCorasick';
import { arrayToInt32Array, stringToBuffer } from './utils';
import { AcTrieNode } from './AcTrieNode';

const ROOT_INDEX = 1;

type StateIndex = number;
type StateIndexes = StateIndex[];

export interface RawAC {
    base: StateIndexes;
    check: StateIndexes;
    failurelink: StateIndexes;
    output: StateIndexes;
    codemap: StateIndexes;
}

export type CompactedAC = {
    [K in keyof RawAC]: Int32Array
}

export type ExportedAC = {
    [K in keyof RawAC]: string;
}

export interface AcState {
    state: AcTrieNode;
    index: number;
}

function compactAC(ac: RawAC): CompactedAC {
    return _.mapValues(ac, arrayToInt32Array) as CompactedAC;
}

export class Builder {
    private ac: RawAC = {
        base: [],
        check: [],
        failurelink: [],
        output: [],
        codemap: [],
    };

    private root = new AcTrieNode();

    constructor(public words: string[] = []) {
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
        const stack: AcState[] = [{ state: baseTrie, index: rootIndex }];
        while (!_.isEmpty(stack)) {
            const { state, index } = stack.pop();
            state.index = index;
            if (state.code) {
                this.ac.codemap[index] = state.code;
            }
            if (state.hasChildren) {
                const v = state.calcBase(this.ac.check);

                this.ac.base[index] = state.pattern ? -v : v;

                // set check
                _.forEach(state.children, (child) => {
                    const nextState = v + child.code;
                    this.ac.check[nextState] = index;
                    stack.push({ state: child, index: nextState });
                });
            }
        }
    }

    private buildAC(): void {
        const baseTrie = this.root;

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
                const failurelink = current.findFailureLink(child.code);
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

    private buildBaseTrie(): AcTrieNode {
        const sortedKeys: Array<Int8Array> = this.words.map(stringToBuffer).sort();

        _.forEach(sortedKeys, wb => this.addWordBuffer(wb));

        return this.root;
    }

    private addWordBuffer(wordBuffer: Int8Array): void {
        const lastCharacterNode = wordBuffer.reduce(
            (node: AcTrieNode, charCode: number) => node.findOrCreateWithCode(charCode),
            this.root,
        );
        lastCharacterNode.pattern = true;
    }
}
