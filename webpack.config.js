var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');


var env = process.env.NODE_ENV || 'development';

var config = {
  context: path.join(__dirname, 'src'),
  entry: {
    qorus: path.resolve('./src/index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    root: path.resolve('./src/js'),
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?optional[]=runtime&stage=0']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style', 'css?sourceMap&minimize'
        )
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?sourceMap!' +
            'sass?sourceMap&outputStyle=compressed'
        )
      },
      {
        test: /\.png$/,
        loader: 'url?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('/css/base.css'),
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(env),
      DEVTOOLS: false
    })
  ]
};

if (env === 'development') {
  config.module.loaders[0].loaders.unshift('react-hot');
  config.module.loaders.push({
    test: require.resolve('react'),
    loader: 'expose?React'
  });

  config.debug = true;
  config.devtool = 'source-map';
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
    outputPublicPath: '/',
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
