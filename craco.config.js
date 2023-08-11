const million = require('million/compiler');

module.exports = {
  webpack: {
    configure: {
      devtool: 'eval-source-map',
    },
    plugins: {
      add: [million.webpack({ auto: true })],
    },
  },
};
