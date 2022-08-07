const path = require("path");
const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: {
    "decent-data-bundle": "./scripts/decent-data-minter.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "assets"),
  },
  resolve: {
    fallback: {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [new Dotenv(), new NodePolyfillPlugin()],
};
