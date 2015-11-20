import Path from "path";
import {assoc, curry, forEach, filter, pipe, prop, keys, map, mapIndexed, range, reduce, reduceIndexed, reverse, slice, sortBy} from "ramda";
import Webpack from "webpack";

// CONSTANTS =======================================================================================
const NODE_MODULES_DIR = Path.join(__dirname, "node_modules");
const SHARED_DIR = Path.join(__dirname, "shared");
const FRONTEND_DIR = Path.join(__dirname, "frontend");
const PUBLIC_DIR = Path.join(__dirname, "public");

// CONFIG ==========================================================================================
export default {
  // Compilation target: http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // Entry files: http://webpack.github.io/docs/configuration.html#entry
  entry: {
    v0: "./v0/app",
    v1: "./v1/app",
    v2: "./v2/app",
    v3: "./v3/app",
  },

  // Output files: http://webpack.github.io/docs/configuration.html#output
  output: {
    // Abs. path to output directory: http://webpack.github.io/docs/configuration.html#output-path
    path: PUBLIC_DIR,

    // Filename of an entry chunk: http://webpack.github.io/docs/configuration.html#output-filename
    filename: "[name].js",

    // Web path (used to prefix URLs): http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/public/",

    // ??? http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    sourceMapFilename: "debugging/[file].map",

    // Include pathinfo in output (like `require(/*./test*/23)`): http://webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // Debug mode: http://webpack.github.io/docs/configuration.html#debug
  debug: true,

  // Enhance debugging: http://webpack.github.io/docs/configuration.html#devtool
  devtool: "source-map",

  // Capture timing information: http://webpack.github.io/docs/configuration.html#profile
  profile: true,

  // http://webpack.github.io/docs/configuration.html#module
  module: {
    // http://webpack.github.io/docs/loaders.html
    loaders: [
      // JS
      {test: /\.(js(\?.*)?)$/, loaders: ["babel?stage=0"], exclude: /node_modules/},

      // CSS: https://github.com/webpack/css-loader (https://github.com/webpack/style-loader)
      {test: /\.(css(\?.*)?)$/, loaders: ["style", "css?sourceMap"]},
    ],
  },

  // Module resolving: http://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    // Abs. path with modules
    root: FRONTEND_DIR,

    // Additional folders
    modulesDirectories: ["web_modules", "node_modules"],
  },

  // Loader resolving: http://webpack.github.io/docs/configuration.html#resolveloader
  resolveLoader: {
    // Abs. path with loaders
    root: NODE_MODULES_DIR,
  },

  // http://webpack.github.io/docs/list-of-plugins.html
  plugins: [
    new Webpack.NoErrorsPlugin(),
    new Webpack.IgnorePlugin(/^vertx$/),
  ],
};
