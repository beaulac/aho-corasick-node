"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayToInt32Array(arr) {
    return Int32Array.from(arr);
}
exports.arrayToInt32Array = arrayToInt32Array;
function int32ArrayToBase64(int32Array) {
    return Buffer.from(int32Array.buffer).toString('base64');
}
exports.int32ArrayToBase64 = int32ArrayToBase64;
function stringToBuffer(s) {
    return new Int8Array(Buffer.from(s, 'utf8'));
}
exports.stringToBuffer = stringToBuffer;
function exportAC(ac) {
    return mapValues(ac, int32ArrayToBase64);
}
exports.exportAC = exportAC;
function compactAC(ac) {
    return mapValues(ac, arrayToInt32Array);
}
exports.compactAC = compactAC;
function mapValues(obj, cb) {
    return (Object.keys(obj))
        .reduce(function (acc, k, _idx) {
        acc[k] = cb(obj[k], k, obj);
        return acc;
    }, {});
}
function ab2str(codes) {
    return String.fromCharCode.apply(null, codes);
}
exports.ab2str = ab2str;
function str2ab(str) {
    var strLen = str.length, buf = new ArrayBuffer(strLen * 2), bufView = new Int16Array(buf);
    for (var i = 0; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}
exports.str2ab = str2ab;
//# sourceMappingURL=utils.js.map