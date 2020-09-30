import http from "http";
import cookieParser from "cookie-parser";
import express from "express";
import { default as LiveReload } from "livereload";

import onError from "./onError";
import onListening from "./onListening";

export function startAppServer(
  port,
  callback: Function,
  options: { liveReload: boolean } = { liveReload: true }
) {
  let liveReloadServer = null;

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.set("port", port);

  const appServer = http.createServer(app);
  appServer.listen(port);
  appServer.on("error", (err) => onError(err, port));
  appServer.on("listening", () => {
    onListening(appServer);
    callback();
  });

  if (options.liveReload) liveReloadServer = LiveReload.createServer();

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
}
