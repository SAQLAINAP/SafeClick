const path = require("path");

module.exports = {
  entry: {
    popup: "./src/popup/index.tsx",
    content: "./src/content/index.ts",
    background: "./src/background/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name]/index.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
}; 