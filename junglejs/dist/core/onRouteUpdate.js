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
const fs_extra_1 = __importDefault(require("fs-extra"));
const isSvelteFile_1 = __importDefault(require("../utils/isSvelteFile"));
const isFileParameters_1 = __importDefault(require("../utils/isFileParameters"));
const colorLog_1 = __importDefault(require("../utils/colorLog"));
const processFile_1 = require("./processFile");
function onRouteUpdate(port, event, path, src, jungleConfig, dirname, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("EVENT: " + event + " " + path)
        if (event == "change" || event == "add" || event == "unlink") {
            const splitPath = path.replace(src, "").split("/");
            const pathNoFile = splitPath.slice(0, splitPath.length - 1).join("/");
            const fileName = splitPath[splitPath.length - 1];
            if (isSvelteFile_1.default(fileName)) {
                if (event == "unlink") {
                    const fileParts = fileName.split(".");
                    if (fileParts[0] == "Index") {
                        colorLog_1.default("red", `Route "${pathNoFile}/${fileName}" won't be removed till after rerunning the build process`);
                    }
                    else {
                        const routeDir = fileParts[0]
                            .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
                            .join("-")
                            .toLowerCase();
                        yield fs_extra_1.default.remove(`jungle/build${pathNoFile}/${routeDir}/`);
                        console.log(`Removed route "${pathNoFile}/${fileName}"`);
                    }
                }
                else {
                    if (isFileParameters_1.default(fileName))
                        yield processFile_1.processFileForParameters(port, fileName, dirname, src, pathNoFile);
                    else
                        yield processFile_1.processFile(fileName, jungleConfig, dirname, src, pathNoFile);
                }
            }
        }
        if (callback)
            callback();
    });
}
exports.default = onRouteUpdate;
