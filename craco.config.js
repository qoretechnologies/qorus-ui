const million = require('million/compiler');

module.exports = {
  webpack: {
    configure: {
      // Disable source maps
      devtool: false,
    },
    plugins: {
      add: [million.webpack({ auto: true })],
    },
  },
};
