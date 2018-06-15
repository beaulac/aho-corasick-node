import * as _ from 'lodash';
import { AhoCorasick } from './AhoCorasick';
import { compactAC, stringToBuffer } from './utils';
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

        const queue: AcTrieNode[] = baseTrie.children.map(
            (child) => {
                child.failurelink = baseTrie;
                this.ac.failurelink[child.index] = baseTrie.index;
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

    private buildBaseTrie(): AcTrieNode {
        this.words
            .map(stringToBuffer)
            .sort()
            .forEach(wb => this.addWordBuffer(wb));
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
