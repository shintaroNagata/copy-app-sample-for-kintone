/* eslint-env node */

const path = require("path");

const scriptsPath = path.resolve(__dirname, "scripts");
const bundlePath = path.resolve(__dirname, "bundle");

module.exports = {
  entry: {
    customize: path.join(scriptsPath, "browser", "copy-single-app"),
  },
  output: {
    path: bundlePath,
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { configFile: "tsconfig.json" },
      },
    ],
  },
};
