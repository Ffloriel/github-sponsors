// import babel from "rollup-plugin-babel"
import builtins from "rollup-plugin-node-builtins"
import resolve from "rollup-plugin-node-resolve"
import json from "rollup-plugin-json"

export default {
    input: "src/index.js",
    output: [
        {
            file: "lib/github-sponsors.es.js",
            format: "es"
        },
        {
            file: "lib/github-sponsors.cjs.js",
            format: "cjs"
        }
    ],
    plugins: [builtins(), resolve(), json()],
    external: ["fs", "util", "child_process", "yaml", "chalk"]
}
