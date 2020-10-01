"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAppServer = exports.startAppServer = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const livereload = require("livereload");
const onError_1 = __importDefault(require("./onError"));
function startAppServer(app, port, callback, options = { liveReload: true }) {
    let liveReloadServer = null;
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(cookie_parser_1.default());
    app.set("port", port);
    const appServer = http_1.default.createServer(app);
    appServer.listen(port);
    appServer.on("error", (err) => onError_1.default(err, port));
    appServer.on("listening", () => {
        onAppListening(appServer);
        callback();
    });
    if (options.liveReload)
        liveReloadServer = livereload.createServer();
    return {
        appServer,
        liveReloadServer,
    };
}
exports.startAppServer = startAppServer;
function stopAppServer(appServer, callback) {
    appServer.close();
    appServer.on("close", () => {
        callback();
    });
}
exports.stopAppServer = stopAppServer;
function onAppListening(server) {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
    console.log("Server listening on ", bind);
}
exports.default = onAppListening;
