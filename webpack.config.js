var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const VENDER_LIBS = [
  "jquery",
  "lodash",
  "moment",
  "react",
  "react-dom",
  "react-redux",
  "react-router",
  "redux",
  "redux-form",
  "redux-thunk",
  "axios"
]

const ifProd = plugin => process.env.NODE_ENV
  ? plugin
  : null;

module.exports = {
  entry: {
    bundle: './client/src/index.js',
    vendor: VENDER_LIBS
  },
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: '[name].[chunkhash].js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({fallbackLoader: "style-loader", loader: "css-loader!sass-loader"})
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }, {
        test: /\.(png|gif|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000?'
      }, {
        test: /\.(woff|ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file-loader?emitFile=false'
      }, {
        test: /\.csv$/,
        loader: 'dsv-loader'
      }, {
        test: /\.less$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ]
      }, {
        test: /\.mp4$/,
        loader: 'url?limit=10000&mimetype=video/mp4'
      }
    ]
  },
  plugins: [
    new webpack
      .optimize
      .CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
    new HtmlWebpackPlugin({template: 'client/src/index.html'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      "global.GENTLY": false
    }),
    // new webpack
    //   .optimize
    //   .UglifyJsPlugin({sourceMap: true}),
    new ExtractTextPlugin('style.css')
  ],
  node: {
    __dirname: true
  },
  devServer: {
    port: 8008
  }
};
