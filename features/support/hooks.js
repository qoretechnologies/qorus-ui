module.exports = function hooks() {
  this.Before(function waitForWorldInit(scenario, callback) {
    this.whenReady(callback);
  });
};
