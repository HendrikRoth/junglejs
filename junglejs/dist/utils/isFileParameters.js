"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFileParameters(file) {
    const fileParts = file.split(".");
    return fileParts[0][0] == "[" && fileParts[0][fileParts[0].length - 1] == "]";
}
exports.default = isFileParameters;
