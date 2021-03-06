"use strict";

const path = require("path");
const production = process.env.NODE_ENV === "production";
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.join(__dirname, "/src/component/init.jsx"),
  mode: production ? "production" : "development",
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      inferno: production ? "inferno" : "inferno/dist/index.dev.esm.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "public/build"),
    filename: "js/main.js",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "css/main.css" }),
    new CopyPlugin([
      { from: "public/src/font", to: "font" }
    ])
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};
