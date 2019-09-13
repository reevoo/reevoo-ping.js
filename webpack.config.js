const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const REEVOO_ENV = process.env.REEVOO_ENV ? process.env.REEVOO_ENV : "dev";
// eslint-disable-next-line import/no-dynamic-require
const webpackConfigFile = require(path.join(__dirname, "config", REEVOO_ENV));
module.exports = {
  // Webpack entry point.
  entry:  "./lib/reevoo-ping.js",
  mode:   REEVOO_ENV === "production" ? "production" : "development",
  // Output definition.
  output: {
    path:           path.join(__dirname, "dist"),
    filename:       "reevoo-ping.js",
    library:        "ReevooPing",
    libraryTarget:  "umd",
    umdNamedDefine: true
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: /@license/i,
          },
        },
      }),
    ],
  },

  // Define loaders for webpack transpilation.
  module: {
    rules: [
      {
        enforce: "pre",
        test:    path.join(__dirname, "lib"),
        loader:  "eslint-loader"
      },
      {
        test:    path.join(__dirname, "lib"),
        exclude: /(node_modules)/,
        loader:  "babel-loader"
      },
      {
        test:   /sp\.js$/,
        loader: "script-loader"
      }
    ]
  },

  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
    // Load config or the building environment
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(webpackConfigFile)
    })
  ],

  // Only output warnings and errors.
  devServer: {
    stats: "errors-only"
  },

  stats: {
    // Nice colored output
    colors: true
  },

  // Create Sourcemaps for the bundle
  devtool: "source-map"
};
