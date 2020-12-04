/* eslint-env node */

const path = require("path");

const scriptsPath = path.resolve(__dirname, "scripts");
const bundlePath = path.resolve(__dirname, "bundle");

module.exports = {
  entry: {
    "copy-single-app": path.join(scriptsPath, "browser", "copy-single-app"),
    "get-related-apps": path.join(scriptsPath, "browser", "get-related-apps"),
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
