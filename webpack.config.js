var path = require('path');
var webpack = require('webpack');

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
      {
        loader: 'babel-loader',
        test: path.join(__dirname, 'lib'),
        query: {
          presets: 'es2015',
        },
      }
    ]
  },

  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],

  stats: {
    // Nice colored output
    colors: true
  },

  // Create Sourcemaps for the bundle
  devtool: 'source-map',
};
