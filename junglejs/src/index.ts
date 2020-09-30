import fetch from "node-fetch";

import normalizePort from "./utils/normalizePort";
import processContent from "./core/processContent";
import { startAppServer } from "./core/appServer";
import { startGraphqlServer } from "./core/graphqlServer";

interface JungleJsParams {
  port?: string | number;
  graphqlPort?: string | number;
  queryName?: string;
  resVarName?: string;
}

export default class JungleJs {
  private port: number;
  private graphqlPort: number;
  private queryName: string;
  private resVarName: string;
  private appServer;
  private graphqlServer;
  private liveReloadServer;

  constructor(params: JungleJsParams) {
    this.port = normalizePort(params.port || process.env.PORT || 3000);
    this.graphqlPort = normalizePort(
      params.graphqlPort || process.env.GRAPHQL_PORT || 3001
    );
    this.queryName = params.queryName || process.env.QUERY_NAME || "QUERY";
    this.resVarName =
      params.resVarName || process.env.RES_VAR_NAME || "QUERYRES";
  }

  async process(content: string) {
    return processContent(content, {queryName: this.queryName, resVarName: this.resVarName, graphqlPort: this.graphqlPort});
  }

  startAppServer(callback: Function) {
    const result = startAppServer(this.port, callback);
    this.appServer = result.appServer;
    this.liveReloadServer = result.liveReloadServer;
  }

  startGraphqlServer(callback: Function) {
    this.graphqlServer = startGraphqlServer(this.graphqlPort, callback);
  }
}
