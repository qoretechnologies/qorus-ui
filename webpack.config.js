var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var env = process.env.NODE_ENV;
if (!env) {
  env = 'development';
}

console.log('weback started in ' + env + ' environment');

var config = {
  context: __dirname + "/src",
  entry: {
    javascript: "./index.js",
    html: "./index.html"
  },
  output: {
    path: __dirname + "/dist",
    filename: "qorus.bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded" },

      { test: /\.jsx?$/, loaders: ["react-hot", "babel-loader?stage=0"], exclude: /node_modules/ },
      { test: /\.html$/, loader: "file?name=[name].[ext]" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: [
    new ExtractTextPlugin("../css/base.css"),
    new ExtractTextPlugin("bootstrap-and-customizations.css")
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // })
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
    inline: true
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
