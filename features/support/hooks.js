module.exports = function hooks() {
  this.Before({ timeout: 60 * 1000 }, function waitForWorldInit(scenario, cb) {
    this.whenReady(cb);
  });
};
