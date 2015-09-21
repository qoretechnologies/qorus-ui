var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var env = process.env.NODE_ENV;
if (!env) {
  env = 'development';
}

var config = {
  context: path.join(__dirname, 'src'),
  entry: {
    javascript: './index.js',
    html: './index.html'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'qorus.bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      // { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      { test: /\.scss$/, loader: 'style!css!sass?outputStyle=expanded' },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader?stage=0'], exclude: /node_modules/
      },
      { test: /\.html$/, loader: 'file?name=[name].[ext]' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }

    ]
  },
  plugins: [
    new ExtractTextPlugin('/css/base.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      React: 'react',
      'window.React': 'react'
    })
  ]
};

if (env === 'development') {
  config.debug = true;
  config.devtool = 'eval-source-map';
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
  config.devServer = {
    contentBase: './src',
    noInfo: false,
    hot: true,
    inline: true,
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/api/*": "http://localhost:8001"
    }
  };
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = config;
