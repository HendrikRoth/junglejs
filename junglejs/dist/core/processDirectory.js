"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDirectoryForParameters = exports.processDirectory = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const asyncForEach_1 = __importDefault(require("../utils/asyncForEach"));
const processFile_1 = require("./processFile");
function processDirectory(config, dirname, src, extension = '') {
    return __awaiter(this, void 0, void 0, function* () {
        yield asyncForEach_1.default(fs_extra_1.default.readdirSync(src + extension), (file) => __awaiter(this, void 0, void 0, function* () {
            if (fs_extra_1.default.statSync(src + extension + '/' + file).isDirectory()) {
                yield processDirectory(config, dirname, src, `${extension}/${file}`);
            }
            else {
                yield processFile_1.processFile(file, config, dirname, src, extension);
            }
        }));
    });
}
exports.processDirectory = processDirectory;
function processDirectoryForParameters(port, config, dirname, src, extension = '', paramGeneratedFiles = []) {
    return __awaiter(this, void 0, void 0, function* () {
        yield asyncForEach_1.default(fs_extra_1.default.readdirSync(src + extension), (file) => __awaiter(this, void 0, void 0, function* () {
            if (fs_extra_1.default.statSync(src + extension + '/' + file).isDirectory()) {
                yield processDirectoryForParameters(port, config, dirname, src, `${extension}/${file}`, paramGeneratedFiles);
            }
            else {
                yield processFile_1.processFileForParameters(port, file, dirname, src, extension);
            }
        }));
        return paramGeneratedFiles;
    });
}
exports.processDirectoryForParameters = processDirectoryForParameters;
