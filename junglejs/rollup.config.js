import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

const pkg = require("./package.json");

export default {
  input: "./src/index.ts",
  plugins: [
    json(),
    typescript(),
    commonjs(),
    resolve()
  ],
  output: [
    { file: pkg.main, name: "junglejs", format: "es" }
  ]
}
