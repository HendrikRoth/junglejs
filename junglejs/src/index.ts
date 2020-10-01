import express from "express";

import normalizePort from "./utils/normalizePort";
import processContent from "./core/processContent";
import readRoutes from "./core/readRoutes";
import { startAppServer } from "./core/appServer";
import { startGraphqlServer } from "./core/graphqlServer";

export interface JungleJsConfig {}

interface JungleJsParams {
  port?: string | number;
  graphqlPort?: string | number;
  queryName?: string;
  resVarName?: string;
  config: JungleJsConfig;
  useGraphIQL?: boolean;
}

export default class JungleJs {
  private port: number;
  private graphqlPort: number;
  private queryName: string;
  private resVarName: string;
  private config: JungleJsConfig;
  private useGraphIQL;

  constructor(params: JungleJsParams) {
    this.port = normalizePort(params.port || process.env.PORT || 3000);
    this.graphqlPort = normalizePort(
      params.graphqlPort || process.env.GRAPHQL_PORT || 3001
    );
    this.queryName = params.queryName || process.env.QUERY_NAME || "QUERY";
    this.resVarName =
      params.resVarName || process.env.RES_VAR_NAME || "QUERYRES";
    this.useGraphIQL = params.useGraphIQL || process.env.USE_GRAPH_IQL || process.env.NODE_ENV === "production";
    this.config = params.config;
  }

  async preprocess() {
    return {
      script: async ({content}) => {
        return processContent(content, {queryName: this.queryName, resVarName: this.resVarName, graphqlPort: this.graphqlPort})
      }
    };
  }

  async startAppServer(app: express.Router) {
    startAppServer(app, this.port);
  }

  async startGraphqlServer(callback) {
    startGraphqlServer(this.config, this.graphqlPort, callback, this.useGraphIQL);
  }

  run(dirname: string) {
    const app = express();
    this.startGraphqlServer(() => readRoutes(this.port, this.config, app, dirname).then(() => this.startAppServer(app)));
  }
}
