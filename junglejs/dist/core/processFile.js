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
exports.processFileForParameters = exports.processFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rollup = __importStar(require("rollup"));
const apollo_boost_1 = __importDefault(require("apollo-boost"));
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fetch = __importStar(require("node-fetch"));
const isSvelteFile_1 = __importDefault(require("../utils/isSvelteFile"));
const isFileParameters_1 = __importDefault(require("../utils/isFileParameters"));
const colorLog_1 = __importDefault(require("../utils/colorLog"));
function processFile(file, jungleConfig, dirname, src, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileParts = file.split('.');
        if (/\s|_|-/.test(fileParts[0])) {
            colorLog_1.default('red', `File "${extension}/${file}" doesn't follow UpperCamelCase`);
        }
        else {
            if (isSvelteFile_1.default(file) && !isFileParameters_1.default(file)) {
                //If Index, set to be root of the built folder, else join a multiword into hyphen seperated lowercase words
                const filename = fileParts[0] != 'Index' ? fileParts[0].match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g).join('-').toLowerCase() : '.';
                yield fs_extra_1.default.ensureDir(`jungle/build${extension}/${filename}/`);
                const mainJs = `import SFile from ${JSON.stringify(path_1.default.join(dirname, `${src}${extension}/${file}`))}; export default new SFile({target: document.body, hydrate: true});`;
                if (yield fs_extra_1.default.pathExists(`${src}${extension}/${file}`)) {
                    yield fs_extra_1.default.writeFile(`jungle/build${extension}/${filename}/main.js`, mainJs);
                    const clientBundle = yield rollup.rollup(jungleConfig.clientInputOptions(filename, extension));
                    yield clientBundle.write(jungleConfig.clientOutputOptions(filename, extension));
                    const ssrBundle = yield rollup.rollup(jungleConfig.ssrInputOptions(filename, extension, src));
                    yield ssrBundle.write(jungleConfig.ssrOutputOptions(filename, extension));
                    yield fs_extra_1.default.remove(`jungle/build${extension}/${filename}/main.js`);
                    yield fs_extra_1.default.remove(`jungle/build${extension}/${filename}/ssr.js`);
                    console.log(`Preprocessed route "${extension}/${file}"`);
                }
            }
        }
    });
}
exports.processFile = processFile;
function processFileForParameters(port, file, dirname, src, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileParts = file.split('.');
        const fileParameters = isFileParameters_1.default(file) ? fileParts[0].substring(1, fileParts[0].length - 1).split(',') : [];
        if (isSvelteFile_1.default(file) && isFileParameters_1.default(file)) {
            const rawSvelteFile = fs_extra_1.default.readFileSync(path_1.default.join(dirname, `${src}${extension}/${file}`), "utf8");
            const queryParamOpts = RegExp(/const QUERYPARAMOPTS = `([^]*?)`;/gm).exec(rawSvelteFile)[1];
            const client = new apollo_boost_1.default({ uri: `http://localhost:${port}/graphql`, fetch: fetch });
            // todo
            const data = Object.values((yield client.query({ query: graphql_tag_1.default `${queryParamOpts}` })).data)[0];
            // todo
            const parameterOptions = {};
            parameterOptions[Object.keys(data[0])[0]] = data.map(m => Object.values(m)[0]);
            fileParameters.forEach(fileParameter => {
                parameterOptions[fileParameter].forEach(paramOption => {
                    const pFilename = paramOption.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
                    const processedFile = rawSvelteFile.replace('${' + `QUERYPARAMS['${fileParameter}']` + '}', paramOption).replace('${' + `QUERYPARAMS["${fileParameter}"]` + '}', paramOption);
                    fs_extra_1.default.ensureDirSync(path_1.default.join(dirname, `jungle/.cache/routes${extension}`));
                    fs_extra_1.default.writeFileSync(path_1.default.join(dirname, `jungle/.cache/routes${extension}/${pFilename}.svelte`), processedFile);
                });
            });
        }
    });
}
exports.processFileForParameters = processFileForParameters;
