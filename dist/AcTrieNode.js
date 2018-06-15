"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AcTrieNode = (function () {
    function AcTrieNode(code, index) {
        this.code = code;
        this.index = index;
        this.children = [];
    }
    Object.defineProperty(AcTrieNode.prototype, "isRoot", {
        get: function () {
            return !this.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AcTrieNode.prototype, "hasChildren", {
        get: function () {
            return this.children.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    AcTrieNode.prototype.calcBase = function (parentIdxArray) {
        var base = Math.max(0, this.index - this.children[0].code) + 1;
        while (this.children.some(function (c) { return !!parentIdxArray[(base + c.code)]; })) {
            ++base;
        }
        return this.base = base;
    };
    AcTrieNode.prototype.setFailureLink = function (link) {
        this.failurelink = link;
        this.output = link.pattern ? link : link.output;
    };
    AcTrieNode.prototype.findFailureLink = function (code) {
        if (!this.failurelink) {
            throw Error('Undefined failurelink');
        }
        return this.failurelink.followFailure(code);
    };
    AcTrieNode.prototype.followFailure = function (code) {
        var childWithCode = this.findChildWithCode(code);
        if (childWithCode) {
            return childWithCode;
        }
        if (this.isRoot) {
            return this;
        }
        return this.findFailureLink(code);
    };
    AcTrieNode.prototype.findChildWithCode = function (code) {
        return this.children.find(function (c) { return c.code === code; });
    };
    AcTrieNode.prototype.findOrCreateWithCode = function (code) {
        var found = this.findChildWithCode(code);
        if (!found) {
            found = new AcTrieNode(code, 0);
            this.children.push(found);
        }
        return found;
    };
    return AcTrieNode;
}());
exports.AcTrieNode = AcTrieNode;
//# sourceMappingURL=AcTrieNode.js.map