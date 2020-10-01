/// <reference types="node" />
import http from "http";
export declare function startAppServer(app: any, port: any, callback?: Function, options?: {
    liveReload: boolean;
}): {
    appServer: http.Server;
    liveReloadServer: any;
};
export declare function stopAppServer(appServer: any, callback: Function): void;
export default function onAppListening(server: http.Server): void;
