const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  styleLoader: ExtractTextPlugin.extract(
    'style',
    'css?sourceMap!' +
      'less?sourceMap&compress'
  ),
  styles: {
    mixins: true,

    core: true,
    icons: true,

    larger: true,
    path: true,
    animated: true
  }
};
