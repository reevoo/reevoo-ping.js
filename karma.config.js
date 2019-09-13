// Karma configuration
const path = require('path')
const webpack = require('webpack')
// eslint-disable-next-line import/no-dynamic-require
const webpackConfigFile = require(path.join(__dirname, 'config', 'test'))

process.env.BABEL_ENV = 'karma'

module.exports = (config) => {
  config.set({
    // root path location to resolve paths defined in files and exclude
    basePath: '',
    // files/patterns to exclude from loaded files
    exclude: [],
    // files/patterns to load in the browser
    files: [
      {
        pattern: 'spec/**/*.spec.js',
        watched: true,
        served: true,
        included: true,
      },
      /* parameters:
          watched: if autoWatch is true all files that have set watched to true will be watched for changes
          served: should the files be served by Karma's webserver?
          included: should the files be included in the browser using <script> tag?
          nocache: should the files be served from disk on each request by Karma's webserver? */
      /* assets:
          {pattern: '*.html', watched:true, served:true, included:false}
          {pattern: 'images/*', watched:false, served:true, included:false} */
    ],

    // executes the tests whenever one of watched files changes
    autoWatch: true,
    // if true, Karma will run tests and then exit browser
    singleRun: false,
    // if true, Karma fails on running empty test-suites
    failOnEmptyTestSuite: false,
    // reduce the kind of information passed to the bash
    logLevel: config.LOG_INFO, // config.LOG_DISABLE, config.LOG_ERROR, config.LOG_INFO, config.LOG_DEBUG
    // list of frameworks you want to use, only jasmine is installed with this boilerplate
    frameworks: ['jasmine'],
    // list of browsers to launch and capture
    browsers: [
      'Chrome' /* "Chrome" ,'PhantomJS','Firefox','Edge','ChromeCanary','Opera','IE','Safari' */,
    ],
    // list of reporters to use
    reporters: ['mocha', 'kjhtml' /* ,'dots','progress','spec' */],

    // address that the server will listen on, '0.0.0.0' is default
    listenAddress: '0.0.0.0',
    // hostname to be used when capturing browsers, 'localhost' is default
    hostname: 'localhost',
    // the port where the web server will be listening, 9876 is default
    port: 9876,
    // when a browser crashes, karma will try to relaunch, 2 is default
    retryLimit: 0,
    // how long does Karma wait for a browser to reconnect, 2000 is default
    browserDisconnectTimeout: 5000,
    // how long will Karma wait for a message from a browser before disconnecting from it, 10000 is default
    browserNoActivityTimeout: 10000,
    // timeout for capturing a browser, 60000 is default
    captureTimeout: 60000,

    client: {
      // capture all console output and pipe it to the terminal, true is default
      captureConsole: false,
      // if true, Karma clears the context window upon the completion of running the tests, true is default
      clearContext: false,
      // run the tests on the same window as the client, without using iframe or a new window, false is default
      runInParent: false,
      // true: runs the tests inside an iFrame; false: runs the tests in a new window, true is default
      useIframe: true,
      jasmine: {
        // tells jasmine to run specs in semi random order, false is default
        random: false,
      },
    },

    // Run webpack on specs.
    preprocessors: {
      'spec/**/*.spec.js': ['webpack', 'sourcemap'],
    },

    // Webpack config for specs
    webpack: {
      mode: 'development',
      // Run babel-loader on each file
      entry: {
        main: './lib/reevoo-ping.js',
      },

      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: /(lib|spec)/,
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                  },
                ],
              ],
              // eslint-disable-next-line global-require,import/no-extraneous-dependencies
              plugins: [require('babel-plugin-rewire')],
            },
          },
        ],
      },

      // Avoid publishing files when compilation fails
      plugins: [
        new webpack.DefinePlugin({
          CONFIG: JSON.stringify(webpackConfigFile),
        }),
      ],

      resolve: {
        extensions: ['.js'],
        modules: ['node_modules', './**'],
        alias: {
          lib: path.join(__dirname, 'lib'),
          spec: path.join(__dirname, 'spec'),
        },
      },
    },
    webpackMiddleware: {
      // turn off webpack bash output when run the tests
      noInfo: true,
      stats: 'errors-only',
    },

    /* karma-mocha-reporter config */
    mochaReporter: {
      output: 'noFailures', // full, autowatch, minimal
    },
  })
}
