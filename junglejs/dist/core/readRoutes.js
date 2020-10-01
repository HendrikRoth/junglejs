"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
const express_1 = __importDefault(require("express"));
const processDirectory_1 = require("./processDirectory");
function readRoutes(port, config, app, dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.remove("jungle/build");
        yield fs_extra_1.default.ensureDir("jungle/build");
        yield fs_extra_1.default.copy("static", "jungle/build");
        const paramGeneratedFiles = yield processDirectory_1.processDirectoryForParameters(port, config, dirname, "src/routes");
        yield processDirectory_1.processDirectory(config, dirname, "src/routes");
        paramGeneratedFiles.forEach((p) => fs_extra_1.default.removeSync(p));
        console.log("Preprocessed Queries");
        app.use(express_1.default.static(path.join(dirname, "jungle/build")));
    });
}
exports.default = readRoutes;
