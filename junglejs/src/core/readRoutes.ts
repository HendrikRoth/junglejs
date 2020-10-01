import fs from "fs-extra";
import * as path from "path";
import express from "express";
import {
  processDirectory,
  processDirectoryForParameters,
} from "./processDirectory";
import { JungleJsConfig } from "..";

export default async function readRoutes(
  port: number,
  config: JungleJsConfig,
  app: express.Router,
  dirname: string
) {
  await fs.remove("jungle/build");
  await fs.ensureDir("jungle/build");
  await fs.copy("static", "jungle/build");

  const paramGeneratedFiles = await processDirectoryForParameters(
    port,
    config,
    dirname,
    "src/routes"
  );
  await processDirectory(config, dirname, "src/routes");
  paramGeneratedFiles.forEach((p) => fs.removeSync(p));

  console.log("Preprocessed Queries");

  app.use(express.static(path.join(dirname, "jungle/build")));
}
