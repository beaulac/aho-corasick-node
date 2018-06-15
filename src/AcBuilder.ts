import * as _ from 'lodash';
import { AhoCorasick } from './AhoCorasick';
import { compactAC, stringToBuffer } from './utils';
import { AcTrieNode } from './AcTrieNode';
import { ROOT_INDEX, StateIndexes } from './AcCommon';

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


export class Builder {
    private ac: RawAC = {
        base: [],
        check: [],
        failurelink: [],
        output: [],
        codemap: [],
    };

    private root = new AcTrieNode(0, ROOT_INDEX);

    constructor(public words: string[] = []) {
    }

    add(word: string) {
        this.words.push(word);
    }

    build() {
        this.buildBaseTrie();
        this.buildDoubleArray();
        this.buildAC();
        return new AhoCorasick(compactAC(this.ac));
    }

    private buildDoubleArray() {
        const stack: AcTrieNode[] = [this.root];
        while (stack.length > 0) {
            const state = stack.pop() as AcTrieNode; // Already empty checked.
            const index = state.index;
            if (state.code) {
                this.ac.codemap[index] = state.code;
            }
            if (state.hasChildren) {
                const v = state.calcBase(this.ac.check);

                this.ac.base[index] = state.pattern ? -v : v;

                // set parent link on children
                _.forEach(state.children, (child) => {
                    const nextState = v + child.code;
                    child.index = nextState;
                    this.ac.check[nextState] = index;
                    stack.push(child);
                });
            }
        }
    }

    private buildAC(): void {
        const queue: AcTrieNode[] = this.root.children.map(
            (child: AcTrieNode) => {
                child.failurelink = this.root;
                this.ac.failurelink[child.index] = this.root.index;
                return child;
            },
        );

        let i = 0;
        while (i < queue.length) {
            const current = queue[i];
            i += 1;
            current.children.forEach((child) => {
                const link = current.findFailureLink(child.code);
                child.setFailureLink(link);

                this.ac.failurelink[child.index] = link.index;
                if (child.output) {
                    this.ac.output[child.index] = child.output.index;
                }
                queue.push(child);
            });
        }
    }

    private buildBaseTrie(): void {
        this.words
            .map(stringToBuffer)
            .sort()
            .forEach(wb => this.addWordBuffer(wb));
    }

    private addWordBuffer(wordBuffer: Int8Array): void {
        const lastCharacterNode = wordBuffer.reduce(
            (node: AcTrieNode, charCode: number) => node.findOrCreateWithCode(charCode),
            this.root,
        );
        lastCharacterNode.pattern = true;
    }
}
