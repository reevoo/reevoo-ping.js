// Karma configuration
var path = require('path');
var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    // Enable Jasmine
    frameworks: ['jasmine'],

    // Load all specs (specs should import their test files from the lib)
    files: [
      'spec/**/*.spec.js'
    ],

    // Run webpack on specs.
    preprocessors: {
      'spec/**/*.spec.js': ['webpack', 'sourcemap']
    },

    // Webpack config for specs
    webpack: {

      // Run babel-loader on each file
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader', query: { presets: 'es2015' } }
        ]
      },

      // Avoid publishing files when compilation fails
      plugins: [
        new webpack.NoErrorsPlugin()
      ],

      resolve: {
        // Setup lib and spec aliases
        alias: {
          lib:  path.join(__dirname, 'lib'),
          spec: path.join(__dirname, 'spec'),
        },
        extensions: ['', '.js'],

        // Enables `import React from 'react'`
        modulesDirectories: ['node_modules'],
      },

      // Create Sourcemaps for the bundle
      devtool: 'inline-source-map',
    },

    webpackMiddleware: {
      noInfo: true
    },

    // More Karma configuration
    reporters: ['dots'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,

  });
};
