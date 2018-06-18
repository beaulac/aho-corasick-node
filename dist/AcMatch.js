"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function buildMatch(matchBuf, endPos) {
    var pattern = utils_1.ab2str(matchBuf), startPos = endPos - (pattern.length - 1);
    return {
        pattern: pattern,
        start: startPos,
        end: endPos,
    };
}
exports.buildMatch = buildMatch;
//# sourceMappingURL=AcMatch.js.map