import fs from "fs-extra";
import path from "path";
import express from "express";
import chokidar from "chokidar";

import copyStaticFiles from "../utils/copyStaticFiles";
import onRouteUpdate from "./onRouteUpdate";

export default async function watchRoutes(port: number, dirname: string, appServer, config) {
  await fs.remove("jungle");
  await fs.ensureDir("jungle/build");
  await fs.ensureDir("jungle/.cache");

  appServer.use(
    require("connect-livereload")({
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
    })
  );

  appServer.use(express.static(path.join(dirname, "jungle/build/")));

  await chokidar
    .watch("src/components")
    .on("all", (e, p) =>
      copyStaticFiles(e, p, "src/components", "jungle/.cache/components")
    );

  await chokidar
    .watch("static")
    .on("all", (e, p) => copyStaticFiles(e, p, "static", "jungle/build"));

  await chokidar
    .watch("src/routes")
    .on("all", (e, p) =>
      onRouteUpdate(port, e, p, "src/routes", config, dirname)
    );

  await chokidar
    .watch("jungle/.cache/routes")
    .on("all", (e, p) =>
      onRouteUpdate(port, e, p, "jungle/.cache/routes", config, dirname)
    );
}
