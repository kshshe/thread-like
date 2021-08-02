import path from "path";

export default {
  mode: "development",
  entry: "./src/browsers.js",
  output: {
    path: path.resolve("lib"),
    filename: "parallelize.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
    ],
  },
};
