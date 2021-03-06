/* eslint-env node */

const path = require("path");

const scriptsPath = path.resolve(__dirname, "scripts");
const bundlePath = path.resolve(__dirname, "bundle");

module.exports = {
  entry: {
    "copy-single-app": path.join(scriptsPath, "browser", "copy-single-app"),
    "copy-multiple-apps": path.join(
      scriptsPath,
      "browser",
      "copy-multiple-apps"
    ),
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
