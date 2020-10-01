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
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const chokidar_1 = __importDefault(require("chokidar"));
const copyStaticFiles_1 = __importDefault(require("../utils/copyStaticFiles"));
const onRouteUpdate_1 = __importDefault(require("./onRouteUpdate"));
function watchRoutes(port, dirname, appServer, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.remove("jungle");
        yield fs_extra_1.default.ensureDir("jungle/build");
        yield fs_extra_1.default.ensureDir("jungle/.cache");
        appServer.use(require("connect-livereload")({
            port: 35729,
            rules: [
                {
                    match: /<\/head>(?![\s\S]*<\/head>)/i,
                    fn: (w, s) => s + w,
                },
                {
                    match: /<\/html>(?![\s\S]*<\/html>)/i,
                    fn: (w, s) => s + w,
                },
                {
                    match: /<\!DOCTYPE.+?>/i,
                    fn: (w, s) => w + s,
                },
            ],
        }));
        appServer.use(express_1.default.static(path_1.default.join(dirname, "jungle/build/")));
        yield chokidar_1.default
            .watch("src/components")
            .on("all", (e, p) => copyStaticFiles_1.default(e, p, "src/components", "jungle/.cache/components"));
        yield chokidar_1.default
            .watch("static")
            .on("all", (e, p) => copyStaticFiles_1.default(e, p, "static", "jungle/build"));
        yield chokidar_1.default
            .watch("src/routes")
            .on("all", (e, p) => onRouteUpdate_1.default(port, e, p, "src/routes", config, dirname));
        yield chokidar_1.default
            .watch("jungle/.cache/routes")
            .on("all", (e, p) => onRouteUpdate_1.default(port, e, p, "jungle/.cache/routes", config, dirname));
    });
}
exports.default = watchRoutes;
