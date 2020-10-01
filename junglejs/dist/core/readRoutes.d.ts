import express from "express";
import { JungleJsConfig } from "..";
export default function readRoutes(port: number, config: JungleJsConfig, app: express.Router, dirname: string): Promise<void>;
