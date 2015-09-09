var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  verbose: true,
  debug: false,
  styleLoader: ExtractTextPlugin.extract("style-loader", "css-loader!sass?outputStyle=expanded"),

  scripts: {
    // "transition": true,
    "dropdown": true,
    "modal": true,
    "popover": true,
    "tooltip": true,
    "tab": true,
    "affix": true,
    "collapse": true,
    "button": true,
    "alert": true

  },
  styles: {
    "mixins": true,
    "normalize": true,
    "print": true,
    "scaffolding": true,
    "type": true,
    "tables": true,
    "forms": true,
    "buttons": true,
    "helper": true,
    "wells": true,
    "grid": true,
    "code": true,
    "dropdowns": true,
    "button-groups": true,
    "input-groups": true,
    "navs": true,
    "alerts": true,
    "progress-bars": true,
    "close": true,
    "modals": true,
    "tooltip": true,
    "popovers": true,
    "utilities": true,
    "badges": true,
    "labels": true
  }
};
