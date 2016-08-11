const path = require('path');
const webpack = require('webpack');

const REEVOO_ENV = process.env.REEVOO_ENV ? process.env.REEVOO_ENV : 'dev';

module.exports = {
  // Webpack entry point.
  entry: './lib/reevoo-ping.js',

  // Output definition.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'reevoo-ping.js',
    library: 'ReevooPing',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  // Define loaders for webpack transpilation.
  module: {
    loaders: [
      {test: path.join(__dirname, 'lib'), loader: 'babel-loader', query: { presets: ['es2015', 'stage-1'] }},
      {test: path.join(__dirname, 'lib'), loader: 'eslint-loader'},
    ],
  },

  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),

    // Load config or the building environment
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(require(path.join(__dirname, 'config', REEVOO_ENV))),
    }),
  ],

  // Only output warnings and errors.
  devServer: {
    stats: 'errors-only',
  },

  stats: {
    // Nice colored output
    colors: true,
  },

  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};
