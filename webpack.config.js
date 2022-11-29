/* global __dirname:false */

var DEBUG = process.argv.indexOf('-p') === -1;
var path = require("path");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const build_dir = path.join(__dirname, "build/");

const externals = {
    'jQuery': 'jquery',
    // 'lodash': '_',
    'underscore': '_',
    'd3': 'd3'
};

module.exports = [
  {
    entry: './src/main.js',
    // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
    devtool: DEBUG ? 'cheap-module-source-map' : false,
    target: 'web',
    output: {
      path: build_dir,
      filename: 'clustergrammer-gl.js',
      libraryTarget: 'var',
      library: 'CGM'
    },
    externals: externals,
    module: {
        rules: [
          // This applies the loader to all of your dependencies,
          // and not any of the source files in your project:
          {
            test: /node_modules/,
            loader: 'ify-loader'
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          }
        ]
    },
    plugins: [
      new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development,
        // ./public directory is being served
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: './',
          index: 'index.html'
        }
      })
    ],
    "mode": "development",
    node: {
       fs: "empty"
    }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: build_dir,
        filename: 'clustergrammer-gl.node.js',
        libraryTarget: 'commonjs2',
        library: 'CGM'
      },
      externals: externals,
      module: {
        rules: [
          // This applies the loader to all of your dependencies,
          // and not any of the source files in your project:
          {
            test: /node_modules/,
            loader: 'ify-loader'
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          }
        ]
      },
      "mode": "development",
      node: {
         fs: "empty"
      }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: build_dir,
        filename: 'clustergrammer-gl.min.js',
        libraryTarget: 'var',
        library: 'CGM'
      },
      externals: externals,
      optimization: {
        minimize: true
      },
      module: {
        rules: [
          // This applies the loader to all of your dependencies,
          // and not any of the source files in your project:
          {
            test: /node_modules/,
            loader: 'ify-loader'
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          }
        ]
      },
      "mode": "production",
      node: {
         fs: "empty"
      }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: build_dir,
        filename: 'clustergrammer-gl.node.min.js',
        libraryTarget: 'commonjs2',
        library: 'CGM'
      },
      externals: externals,
      optimization: {
        minimize: true
      },
      "mode": "production",
      module: {
        rules: [
          // This applies the loader to all of your dependencies,
          // and not any of the source files in your project:
          {
            test: /node_modules/,
            loader: 'ify-loader'
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          }
        ]
      },
      node: {
         fs: "empty"
      }
  }
];
