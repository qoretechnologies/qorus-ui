module.exports = function hooks() {
  this.Before(function waitForWorldInit(scenario, cb) {
    this.whenReady(cb);
  });
};
