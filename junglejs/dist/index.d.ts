import express from "express";
export interface JungleJsConfig {
}
interface JungleJsParams {
    port?: string | number;
    graphqlPort?: string | number;
    queryName?: string;
    resVarName?: string;
    config: JungleJsConfig;
    useGraphIQL?: boolean;
}
export default class JungleJs {
    private port;
    private graphqlPort;
    private queryName;
    private resVarName;
    private config;
    private useGraphIQL;
    constructor(params: JungleJsParams);
    preprocess(): Promise<{
        script: ({ content }: {
            content: any;
        }) => Promise<{
            code: string;
        }>;
    }>;
    startAppServer(app: express.Router): Promise<void>;
    startGraphqlServer(callback: any): Promise<void>;
    run(dirname: string): void;
}
export {};
