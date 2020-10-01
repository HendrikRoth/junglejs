import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
const livereload = require("livereload");

import onError from "./onError";

export function startAppServer(
  app,
  port,
  callback?: Function,
  options: { liveReload: boolean } = { liveReload: true }
) {
  let liveReloadServer = null;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set("port", port);

  const appServer = http.createServer(app);
  appServer.listen(port);
  appServer.on("error", (err) => onError(err, port));
  appServer.on("listening", () => {
    onAppListening(appServer);
    callback();
  });

  if (options.liveReload) liveReloadServer = livereload.createServer();

  return {
    appServer,
    liveReloadServer,
  };
}

export function stopAppServer(appServer, callback: Function) {
  appServer.close();
  appServer.on("close", () => {
    callback();
  });
}

export default function onAppListening(server: http.Server) {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
  console.log("Server listening on ", bind);
}
