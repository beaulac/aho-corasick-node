import { convert, hexToInt32Array, int32ArrayToHex, stringToBuffer } from './utils';
import * as _ from 'lodash';
import { Builder } from './AcBuilder';

const ROOT_INDEX = 1;

export class AhoCorasick {
    constructor(public data) {
    }

    match(text) {
        return this.search(text);
    }

    private search(text) {
        const result = [];
        const codes = stringToBuffer(text);
        let currentIndex = ROOT_INDEX;

        _.forEach(codes, (code) => {
            const nextIndex = this.getNextIndex(currentIndex, code);

            if (this.data.base[nextIndex] < 0 || !this.data.base[nextIndex]) {
                result.push(convert(this.getPattern(nextIndex)));
            }
            const outputs = this.getOutputs(nextIndex);
            _.forEach(outputs, (output) => {
                result.push(convert(output));
            });
            currentIndex = nextIndex;
        });

        return _.uniq(result).sort();
    }

    private getOutputs(index) {
        const output = this.data.output[index];
        if (output) {
            return [this.getPattern(output)].concat(this.getOutputs(output));
        }
        return [];
    }

    getPattern(index) {
        if (index <= ROOT_INDEX) {
            return [];
        }
        const code = this.data.codemap[index];
        const parent = this.data.check[index];
        const res = this.getPattern(parent);
        res.push(code);
        return res;
    }

    private getNextIndex(currentIndex, code) {
        const nextIndex = this.getBase(currentIndex) + code;
        if (nextIndex && this.data.check[nextIndex] === currentIndex) {
            return nextIndex;
        }
        return this.getNextIndexByFailure(this.data, currentIndex, code);
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

    static from(buffers) {
        return new AhoCorasick(_.mapValues(buffers, hexToInt32Array));
    }

    static builder() {
        return new Builder();
    }
}
