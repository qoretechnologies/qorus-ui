const million = require('million/compiler');

module.exports = {
  // Ensure Babel understands top-level await syntax; Webpack will handle it at build time
  babel: {
    plugins: ['@babel/plugin-syntax-top-level-await'],
  },
  webpack: {
    // Use a function so we can tweak advanced options (experiments)
    configure: (webpackConfig) => {
      // Disable source maps
      webpackConfig.devtool = false;

      // Enable Webpack support for top-level await
      webpackConfig.experiments = {
        ...(webpackConfig.experiments || {}),
        topLevelAwait: true,
      };

      return webpackConfig;
    },
    plugins: {
      add: [million.webpack({ auto: true })],
    },
  },
};
