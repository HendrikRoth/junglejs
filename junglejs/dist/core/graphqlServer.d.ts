/// <reference types="node" />
import http from "http";
export declare function graphqlExpress(config: any, graphiql?: boolean): import("express-serve-static-core").Express;
export declare function startGraphqlServer(config: any, port: number, callback: Function, graphiql?: boolean): http.Server;
export declare function stopGraphqlServer(graphqlServer: any, callback: Function): void;
export declare function onGraphqlListening(graphqlServer: http.Server): void;
