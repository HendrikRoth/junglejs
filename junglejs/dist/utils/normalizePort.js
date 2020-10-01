"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizePort(val) {
    let port;
    if (typeof val === "string") {
        port = parseInt(val, 10);
        if (isNaN(port))
            throw new Error("Could not normalize the port " + val);
    }
    else
        return val;
    if (port >= 0)
        return port;
    throw new Error("Could not normalize the port " + val);
}
exports.default = normalizePort;
