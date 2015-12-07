var path = require('path');
var webpack = require('webpack');

const REEVOO_ENV = process.env.REEVOO_ENV ? process.env.REEVOO_ENV : 'dev';

module.exports = {
  // Webpack entry point.
  entry: './lib/reevoo-ping.js',

  // Output definition.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'reevoo-ping.js'
  },

  // Define loaders for webpack transpilation.
  module: {
    loaders: [
      {test: path.join(__dirname, 'lib'), loader: 'babel-loader', query: { presets: 'es2015' }},
      {test: path.join(__dirname, 'lib'), loader: "eslint-loader", exclude: /node_modules/}
    ]
  },

  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(require(path.join(__dirname, 'config', REEVOO_ENV))),
    })
  ],

  stats: {
    // Nice colored output
    colors: true
  },

  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};
