"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AhoCorasick_1 = require("./AhoCorasick");
var utils_1 = require("./utils");
var AcTrieNode_1 = require("./AcTrieNode");
var AcCommon_1 = require("./AcCommon");
var AcBuilder = (function () {
    function AcBuilder(words) {
        if (words === void 0) { words = []; }
        this.words = words;
        this.ac = {
            base: [],
            check: [],
            failurelink: [],
            output: [],
            codemap: [],
        };
        this.root = new AcTrieNode_1.AcTrieNode(0, AcCommon_1.ROOT_INDEX);
    }
    AcBuilder.prototype.add = function (word) {
        this.words.push(word);
    };
    AcBuilder.prototype.build = function () {
        this.buildBaseTrie();
        this.buildDoubleArray();
        this.buildAC();
        return new AhoCorasick_1.AhoCorasick(utils_1.compactAC(this.ac));
    };
    AcBuilder.prototype.buildDoubleArray = function () {
        var _this = this;
        var stack = [this.root];
        var _loop_1 = function () {
            var state = stack.pop();
            var index = state.index;
            if (state.code) {
                this_1.ac.codemap[index] = state.code;
            }
            if (state.hasChildren) {
                var v_1 = state.calcBase(this_1.ac.check);
                this_1.ac.base[index] = state.pattern ? -v_1 : v_1;
                state.children.forEach(function (child) {
                    var nextState = v_1 + child.code;
                    child.index = nextState;
                    _this.ac.check[nextState] = index;
                    stack.push(child);
                });
            }
        };
        var this_1 = this;
        while (stack.length > 0) {
            _loop_1();
        }
    };
    AcBuilder.prototype.buildAC = function () {
        var _this = this;
        var queue = this.root.children.map(function (child) {
            child.failurelink = _this.root;
            _this.ac.failurelink[child.index] = _this.root.index;
            return child;
        });
        var i = 0;
        var _loop_2 = function () {
            var current = queue[i];
            i += 1;
            current.children.forEach(function (child) {
                var link = current.findFailureLink(child.code);
                child.setFailureLink(link);
                _this.ac.failurelink[child.index] = link.index;
                if (child.output) {
                    _this.ac.output[child.index] = child.output.index;
                }
                queue.push(child);
            });
        };
        while (i < queue.length) {
            _loop_2();
        }
    };
    AcBuilder.prototype.buildBaseTrie = function () {
        var _this = this;
        this.words
            .map(utils_1.stringToBuffer)
            .sort()
            .forEach(function (wb) { return _this.addWordBuffer(wb); });
    };
    AcBuilder.prototype.addWordBuffer = function (wordBuffer) {
        var lastCharacterNode = wordBuffer.reduce(function (node, charCode) { return node.findOrCreateWithCode(charCode); }, this.root);
        lastCharacterNode.pattern = true;
    };
    return AcBuilder;
}());
exports.AcBuilder = AcBuilder;
//# sourceMappingURL=AcBuilder.js.map