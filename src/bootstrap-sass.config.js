const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  styleLoader: ExtractTextPlugin.extract(
    'style',
    'css?sourceMap!' +
      'sass?sourceMap&outputStyle=compressed'
  ),
  scripts: {
    'dropdown': false,
    'modal': false,
    'popover': false,
    'tooltip': false,
    'tab': false,
    'affix': false,
    'collapse': false,
    'button': false,
    'alert': false
  },
  styles: {
    'mixins': true,
    'normalize': true,
    'print': true,
    'scaffolding': true,
    'type': true,
    'tables': true,
    'forms': true,
    'buttons': true,
    'helper': true,
    'wells': true,
    'grid': true,
    'code': true,
    'dropdowns': true,
    'button-groups': true,
    'input-groups': true,
    'navs': true,
    'alerts': true,
    'progress-bars': true,
    'close': true,
    'modals': true,
    'tooltip': true,
    'popovers': true,
    'utilities': true,
    'badges': true,
    'labels': true,
    'navbar': true
  }
};
