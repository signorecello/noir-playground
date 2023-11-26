import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import { wasm } from "@rollup/plugin-wasm";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import webWorkerLoader from "rollup-plugin-web-worker-loader";

console.log(`Current Working Directory: ${process.cwd()}`);
console.log(`Node modules in: ${path.join(process.cwd(), "..", "..")}`);

const base = {
  input: "src/index.ts",
  plugins: [commonjs(), json(), wasm(), webWorkerLoader()],
  external: (id) => id.endsWith(".css"),
};

const cjs = {
  ...base,
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
      interop: "auto",
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      declaration: true,
      declarationDir: "dist/cjs",
    }),
    copy({
      targets: [{ src: "src/**/*.wasm", dest: "dist/cjs" }],
    }),
  ],
};

const esm = {
  ...base,
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      interop: "auto",
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      declaration: true,
      declarationDir: "dist/esm",
    }),
    copy({
      targets: [
        { src: "src/**/*.wasm", dest: "dist/esm" },
        { src: "src/**/*.json", dest: "dist/esm" },
      ],
    }),
  ],
};

// // add terser at the end of the plugins array
// [esm, cjs].forEach((config) => {
//   config.plugins.push(terser());
// });

console.log(esm);

export default [cjs, esm];
