import fs from "fs-extra";

import isSvelteFile from "../utils/isSvelteFile";
import isFileParameters from "../utils/isFileParameters";
import colorLog from "../utils/colorLog";
import { processFile, processFileForParameters } from "./processFile";

export default async function onRouteUpdate(
  port: number,
  event: string,
  path: string,
  src,
  jungleConfig,
  dirname,
  callback?
) {
  //console.log("EVENT: " + event + " " + path)
  if (event == "change" || event == "add" || event == "unlink") {
    const splitPath = path.replace(src, "").split("/");
    const pathNoFile = splitPath.slice(0, splitPath.length - 1).join("/");
    const fileName = splitPath[splitPath.length - 1];

    if (isSvelteFile(fileName)) {
      if (event == "unlink") {
        const fileParts = fileName.split(".");
        if (fileParts[0] == "Index") {
          colorLog(
            "red",
            `Route "${pathNoFile}/${fileName}" won't be removed till after rerunning the build process`
          );
        } else {
          const routeDir = fileParts[0]
            .match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g)
            .join("-")
            .toLowerCase();

          await fs.remove(`jungle/build${pathNoFile}/${routeDir}/`);
          console.log(`Removed route "${pathNoFile}/${fileName}"`);
        }
      } else {
        if (isFileParameters(fileName))
          await processFileForParameters(port, fileName, dirname, src, pathNoFile);
        else
          await processFile(fileName, jungleConfig, dirname, src, pathNoFile);
      }
    }
  }

  if (callback) callback();
}
