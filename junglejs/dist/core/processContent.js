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
const acorn_1 = __importDefault(require("acorn"));
const acorn_walk_1 = __importDefault(require("acorn-walk"));
const apollo_boost_1 = __importDefault(require("apollo-boost"));
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fetch = __importStar(require("node-fetch"));
function processContent(content, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryVarStart, queryVarEnd, resVarStart, resVarEnd;
        const { queryName, resVarName, graphqlPort } = options;
        const tree = acorn_1.default.parse(content, { sourceType: "module" });
        acorn_walk_1.default.simple(tree, {
            VariableDeclaration(node) {
                // todo
                node.declarations.forEach((declaration) => {
                    if (declaration.id.name === queryName) {
                        queryVarStart = declaration.init.start + 1;
                        queryVarEnd = declaration.init.end + 1;
                    }
                    else if (declaration.id.name === resVarName) {
                        resVarStart = declaration.start;
                        resVarEnd = declaration.end;
                    }
                });
            },
        });
        if (!resVarStart || !queryVarStart)
            return { code: content };
        const query = content.slice(queryVarStart, queryVarEnd);
        const client = new apollo_boost_1.default({
            uri: `http://localhost:${graphqlPort}/graphql`,
            fetch: fetch,
        });
        const result = (yield client.query({
            query: graphql_tag_1.default `
        ${query}
      `,
        })).data;
        const data = JSON.stringify(result);
        const finalCode = content.slice(0, resVarStart) +
            resVarName +
            " = " +
            data +
            content.slice(resVarEnd, content.length);
        return { code: finalCode };
    });
}
exports.default = processContent;
