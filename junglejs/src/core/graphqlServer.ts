import cors from "cors";
import http from "http";
import express from "express";
import graphqlRouter from "express-graphql";
import cookieParser from "cookie-parser";

import onError from "./onError";
import generateSchema from "./generateSchema";

export function graphqlExpress(config, graphiql: boolean = false) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(cors());
  app.use('/graphql', graphqlRouter({ schema: generateSchema(config.dataSources), graphiql }));
  return app;
}

export function startGraphqlServer(config, port: number, callback: Function, graphiql?: boolean) {
  const graphqlExpressServer = graphqlExpress(config, graphiql);
  const graphqlServer = http.createServer(graphqlExpressServer);
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
  console.log("GraphQL server listening on", bind);
}
