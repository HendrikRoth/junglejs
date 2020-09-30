import http from "http";

import onError from "./onError";

export function startGraphqlServer(port: number, callback: Function) {
  const graphqlServer = http.createServer();
  graphqlServer.listen(port);
  graphqlServer.on("error", (err: Error) => onError(err, port));
  graphqlServer.on("listening", () => {
    onGraphqlListening(graphqlServer);
    callback();
  });
  return graphqlServer;
}

export function stopGraphqlServer(graphqlServer, callback: Function) {
  graphqlServer.close();
  graphqlServer.on("close", () => {
    callback();
  });
}

export function onGraphqlListening(graphqlServer: http.Server) {
  const addr = graphqlServer.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : "http://localhost:" + addr.port;
}
