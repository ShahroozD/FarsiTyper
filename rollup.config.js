import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/farsitype.min.js",
    format: "iife",
    name: "FarsiTypeBundle",
    plugins: [terser()],
  },
  plugins: [terser()],
};
