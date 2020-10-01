"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSvelteFile(file) {
    const fileParts = file.split('.');
    return fileParts[fileParts.length - 1] === 'svelte' && fileParts.length == 2;
}
exports.default = isSvelteFile;
