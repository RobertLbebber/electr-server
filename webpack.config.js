var path = require("path");
var fs = require("fs");

module.exports = {
  entry: fs
    .readdirSync(path.join(__dirname, "./endpoints"))
    .filter(filename => /\.js$/.test(filename))
    .map(filename => {
      var entry = {};
      entry[filename.replace(".js", "")] = path.join(__dirname, "./endpoints/", filename);
      return entry;
    })
    .reduce((finalObject, entry) => Object.assign(finalObject, entry), {}),
  output: {
    path: path.join(__dirname, "dist"),
    library: "[name]",
    libraryTarget: "commonjs2",
    filename: "[name].js",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: JSON.parse(fs.readFileSync(path.join(__dirname, ".babelrc"), { encoding: "utf8" })),
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: "json-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: { "@": path.resolve(__dirname, "src") },
  },
};
