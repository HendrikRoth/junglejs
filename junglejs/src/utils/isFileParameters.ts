export default function isFileParameters(file: string) {
  const fileParts = file.split(".");
  return fileParts[0][0] == "[" && fileParts[0][fileParts[0].length - 1] == "]";
}
