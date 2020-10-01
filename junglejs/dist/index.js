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
const express_1 = __importDefault(require("express"));
const normalizePort_1 = __importDefault(require("./utils/normalizePort"));
const processContent_1 = __importDefault(require("./core/processContent"));
const readRoutes_1 = __importDefault(require("./core/readRoutes"));
const appServer_1 = require("./core/appServer");
const graphqlServer_1 = require("./core/graphqlServer");
class JungleJs {
    constructor(params) {
        this.port = normalizePort_1.default(params.port || process.env.PORT || 3000);
        this.graphqlPort = normalizePort_1.default(params.graphqlPort || process.env.GRAPHQL_PORT || 3001);
        this.queryName = params.queryName || process.env.QUERY_NAME || "QUERY";
        this.resVarName =
            params.resVarName || process.env.RES_VAR_NAME || "QUERYRES";
        this.useGraphIQL = params.useGraphIQL || process.env.USE_GRAPH_IQL || process.env.NODE_ENV === "production";
        this.config = params.config;
    }
    preprocess() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                script: ({ content }) => __awaiter(this, void 0, void 0, function* () {
                    return processContent_1.default(content, { queryName: this.queryName, resVarName: this.resVarName, graphqlPort: this.graphqlPort });
                })
            };
        });
    }
    startAppServer(app) {
        return __awaiter(this, void 0, void 0, function* () {
            appServer_1.startAppServer(app, this.port);
        });
    }
    startGraphqlServer(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            graphqlServer_1.startGraphqlServer(this.config, this.graphqlPort, callback, this.useGraphIQL);
        });
    }
    run(dirname) {
        const app = express_1.default();
        this.startGraphqlServer(() => readRoutes_1.default(this.port, this.config, app, dirname).then(() => this.startAppServer(app)));
    }
}
exports.default = JungleJs;
