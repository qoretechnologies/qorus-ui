// @flow
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const merge = require('webpack-merge');

// Root path
const root = path.resolve(__dirname, './');

//*
//* COMMON CONFIG
//*
let webpackConfig = {
  name: 'qorus',
  context: `${root}/src`,
  cache: false,
  output: {
    path: `${root}/dist`,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
    pathinfo: false,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(html|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(c|sc)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|eot|mp3)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/base.css',
      chunkFilename: 'css/[name].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.ProvidePlugin({
      fetch:
        'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
  ],
};

//* DEVELOPMENT CONFIG
if (process.env.NODE_ENV === 'development') {
  webpackConfig = merge(webpackConfig, {
    entry: {
      vendors: ['webpack-hot-middleware/client'],
      qorus: [`${root}/src/index.jsx`],
    },
    mode: 'development',
    devtool: 'source-map',
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  });

  //* PRODUCTION CONFIG
} else {
  webpackConfig = merge(webpackConfig, {
    entry: { qorus: [`${root}/src/index.jsx`] },
    mode: 'production',
    devtool: false,
    stats: {
      colors: false,
      hash: true,
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      children: true,
    },
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            enforce: true,
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
      }),
    ],
  });
}

module.exports = webpackConfig;
