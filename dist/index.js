"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var AcBuilder_1 = require("./AcBuilder");
var AhoCorasick_1 = require("./AhoCorasick");
var utils_1 = require("./utils");
__export(require("./AcCommon"));
function acBuilder() {
    return new AcBuilder_1.AcBuilder();
}
exports.acBuilder = acBuilder;
function from(buffers) {
    return new AhoCorasick_1.AhoCorasick(utils_1.compactAC(buffers));
}
exports.from = from;
//# sourceMappingURL=index.js.map