"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AcCommon_1 = require("./AcCommon");
var utils_1 = require("./utils");
var AcMatch_1 = require("./AcMatch");
var AhoCorasick = (function () {
    function AhoCorasick(data) {
        this.data = data;
        this.currentState = AcCommon_1.ROOT_INDEX;
    }
    AhoCorasick.prototype.match = function (text) {
        var _this = this;
        var matches = new Set();
        var codes = utils_1.str2ab(text);
        codes.forEach(function (charCode, pos) {
            var nextIndex = _this.getNextIndex(charCode);
            var nextBase = _this.data.base[nextIndex];
            if (~~nextBase <= 0) {
                matches.add(AcMatch_1.buildMatch(_this.getPattern(nextIndex), pos));
            }
            _this.getOutputs(nextIndex)
                .forEach(function (output) { return matches.add(AcMatch_1.buildMatch(output, pos)); });
            _this.currentState = nextIndex;
        });
        this.currentState = AcCommon_1.ROOT_INDEX;
        return Array.from(matches).sort();
    };
    AhoCorasick.prototype.getOutputs = function (index) {
        var output = this.data.output[index];
        if (output) {
            return [this.getPattern(output)].concat(this.getOutputs(output));
        }
        return [];
    };
    AhoCorasick.prototype.getPattern = function (index) {
        return index > AcCommon_1.ROOT_INDEX
            ? this.getPattern(this.data.check[index]).concat([this.data.codemap[index]]) : [];
    };
    AhoCorasick.prototype.getNextIndex = function (code) {
        var nextIndex = this.getBase(this.currentState) + code;
        if (nextIndex && this.data.check[nextIndex] === this.currentState) {
            return nextIndex;
        }
        return this.getNextIndexByFailure(this.data, this.currentState, code);
    };
    AhoCorasick.prototype.getNextIndexByFailure = function (ac, currentIndex, code) {
        var failure = ac.failurelink[currentIndex];
        if (!failure || !this.getBase(failure)) {
            failure = AcCommon_1.ROOT_INDEX;
        }
        var failureNext = this.getBase(failure) + code;
        if (failureNext && ac.check[failureNext] === failure) {
            return failureNext;
        }
        if (currentIndex === AcCommon_1.ROOT_INDEX) {
            return AcCommon_1.ROOT_INDEX;
        }
        return this.getNextIndexByFailure(ac, failure, code);
    };
    AhoCorasick.prototype.getBase = function (index) {
        return Math.abs(this.data.base[index]);
    };
    return AhoCorasick;
}());
exports.AhoCorasick = AhoCorasick;
//# sourceMappingURL=AhoCorasick.js.map