"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGraphqlListening = exports.stopGraphqlServer = exports.startGraphqlServer = exports.graphqlExpress = void 0;
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const onError_1 = __importDefault(require("./onError"));
const generateSchema_1 = __importDefault(require("./generateSchema"));
function graphqlExpress(config, graphiql = false) {
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cookie_parser_1.default());
    app.use(cors_1.default());
    app.use('/graphql', express_graphql_1.default({ schema: generateSchema_1.default(config.dataSources), graphiql }));
    return app;
}
exports.graphqlExpress = graphqlExpress;
function startGraphqlServer(config, port, callback, graphiql) {
    const graphqlExpressServer = graphqlExpress(config, graphiql);
    const graphqlServer = http_1.default.createServer(graphqlExpressServer);
    graphqlServer.listen(port);
    graphqlServer.on("error", (err) => onError_1.default(err, port));
    graphqlServer.on("listening", () => {
        onGraphqlListening(graphqlServer);
        callback();
    });
    return graphqlServer;
}
exports.startGraphqlServer = startGraphqlServer;
function stopGraphqlServer(graphqlServer, callback) {
    graphqlServer.close();
    graphqlServer.on("close", () => {
        callback();
    });
}
exports.stopGraphqlServer = stopGraphqlServer;
function onGraphqlListening(graphqlServer) {
    const addr = graphqlServer.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("GraphQL server listening on", bind);
}
exports.onGraphqlListening = onGraphqlListening;
