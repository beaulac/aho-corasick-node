import { compactAC, convert, int32ArrayToHex, stringToBuffer } from './utils';
import * as _ from 'lodash';
import { Builder, CompactedAC, RawAC } from './AcBuilder';

const ROOT_INDEX = 1;

export class AhoCorasick {

    private currentIndex = ROOT_INDEX;

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
            const outputs = this.getOutputs(nextIndex);
            _.forEach(outputs, (output) => {
                result.push(convert(output));
            });
            this.currentIndex = nextIndex;
        });

        this.currentIndex = ROOT_INDEX;

        return _.uniq(result).sort();
    }

    private getOutputs(index) {
        const output = this.data.output[index];
        if (output) {
            return [...this.getPattern(output), ...this.getOutputs(output)];
        }
        return [];
    }

    getPattern(index): number[] {
        return index > ROOT_INDEX
            ? [...this.getPattern(this.data.check[index]), this.data.codemap[index]]
            : [];
    }

    private getNextIndex(code) {
        const nextIndex = this.getBase(this.currentIndex) + code;
        if (nextIndex && this.data.check[nextIndex] === this.currentIndex) {
            return nextIndex;
        }
        return this.getNextIndexByFailure(this.data, this.currentIndex, code);
    }

    private getNextIndexByFailure(ac, currentIndex, code) {
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

    private getBase(index) {
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
