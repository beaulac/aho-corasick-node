import { compactAC, convert, exportAC, stringToBuffer } from './utils';
import { Builder } from './AcBuilder';
import { CharCode, CompactedAC, RawAC, ROOT_INDEX, StateIdx } from './AcCommon';

export interface AcMatch {
    pattern: string;
    start: number;
    end: number;
}

export class AhoCorasick {

    private currentState: StateIdx = ROOT_INDEX;

    constructor(public data: CompactedAC) {
    }

    public match(text: string): string[] {
        const matches = new Set<string>();
        const codes = stringToBuffer(text);

        codes.forEach(
            (code) => {
                const nextIndex = this.getNextIndex(code);

                const nextBase = this.data.base[nextIndex];
                if (~~nextBase <= 0) {
                    matches.add(convert(this.getPattern(nextIndex)));
                }

                // Is this really needed?
                this.getOutputs(nextIndex)
                    .forEach((output: CharCode[]) => matches.add(convert(output)));

                this.currentState = nextIndex;
            },
        );

        this.currentState = ROOT_INDEX;

        return Array.from(matches).sort();
    }

    private getOutputs(index: StateIdx): Array<CharCode[]> {
        const output = this.data.output[index];
        if (output) {
            return [this.getPattern(output), ...this.getOutputs(output)];
        }
        return [];
    }

    getPattern(index: StateIdx): CharCode[] {
        return index > ROOT_INDEX
            ? [...this.getPattern(this.data.check[index]), this.data.codemap[index]]
            : [];
    }

    private getNextIndex(code: CharCode): StateIdx {
        const nextIndex = this.getBase(this.currentState) + code;
        if (nextIndex && this.data.check[nextIndex] === this.currentState) {
            return nextIndex;
        }
        return this.getNextIndexByFailure(this.data, this.currentState, code);
    }

    private getNextIndexByFailure(ac: CompactedAC, currentIndex: StateIdx, code: CharCode): StateIdx {
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

    private getBase(index: StateIdx): StateIdx {
        return Math.abs(this.data.base[index]);
    }

    public export() {
        return exportAC(this.data);
    }

    public static from(buffers: RawAC) {
        return new AhoCorasick(compactAC(buffers));
    }

    public static builder() {
        return new Builder();
    }
}
