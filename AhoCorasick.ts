import { compactAC, convert, int32ArrayToHex, stringToBuffer } from './utils';
import * as _ from 'lodash';
import { Builder, CompactedAC, RawAC } from './AcBuilder';

type StateIdx = number;
type CharCode = number;
const ROOT_INDEX: StateIdx = 1;

interface AcMatch {
    pattern: string;
    start: number;
    end: number;
}

export class AhoCorasick {

    private currentState: StateIdx = ROOT_INDEX;

    constructor(public data: CompactedAC) {
    }

    public match(text) {
        const result = [];
        const codes = stringToBuffer(text);

        _.forEach(codes, (code) => {
            const nextIndex = this.getNextIndex(code);

            const nextBase = this.data.base[nextIndex];
            if (~~nextBase <= 0) {
                result.push(convert(this.getPattern(nextIndex)));
            }

            // Is this really needed?
            // this.getOutputs(nextIndex)
            //     .forEach((output) => result.push(convert(output)));

            this.currentState = nextIndex;
        });

        this.currentState = ROOT_INDEX;

        return _.uniq(result).sort();
    }

    private getOutputs(index): Array<CharCode> {
        const output = this.data.output[index];
        if (output) {
            return [...this.getPattern(output), ...this.getOutputs(output)];
        }
        return [];
    }

    getPattern(index): CharCode[] {
        return index > ROOT_INDEX
            ? [...this.getPattern(this.data.check[index]), this.data.codemap[index]]
            : [];
    }

    private getNextIndex(code): StateIdx {
        const nextIndex = this.getBase(this.currentState) + code;
        if (nextIndex && this.data.check[nextIndex] === this.currentState) {
            return nextIndex;
        }
        return this.getNextIndexByFailure(this.data, this.currentState, code);
    }

    private getNextIndexByFailure(ac, currentIndex, code): StateIdx {
        let failure = ac.failurelink[currentIndex];
        if (!failure || !this.getBase(failure)) {
            failure = ROOT_INDEX;
        }
        const failureNext = this.getBase(failure) + code;
        if (failureNext && ac.check[failureNext] === failure) {
            return failureNext;
        }
        if (currentIndex === ROOT_INDEX) {
            return ROOT_INDEX;
        }
        return this.getNextIndexByFailure(ac, failure, code);
    }

    private getBase(index): StateIdx {
        return Math.abs(this.data.base[index]);
    }

    export() {
        return _.mapValues(this.data, int32ArrayToHex);
    }

    static from(buffers: RawAC) {
        return new AhoCorasick(compactAC(buffers));
    }

    static builder() {
        return new Builder();
    }
}
