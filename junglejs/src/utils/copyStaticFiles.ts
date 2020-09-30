import fs from "fs-extra";

export default async function copyStaticFiles(
  event: string,
  path: string,
  input: string,
  output: string
) {
  if (event == "change" || event == "add") {
    const subPath = path.replace(input, "");
    await fs.copy(path, output + subPath);
  } else if (event == "unlink") {
    const subPath = path.replace(input, "");
    fs.remove(output + subPath);
  }
}
