module.exports = function env() {
  //XXX Should be this long only while for the server to initialize
  // not for every step
  this.setDefaultTimeout(60 * 1000);
};
