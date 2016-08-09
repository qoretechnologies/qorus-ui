module.exports = function notificationSteps() {
  this.Then(/^Notification badge equals "([^"]*)"$/, async function(value) {
    await this.waitForChange(2000);
    this.browser.assert.text('.notification-button .badge', value);
  });
}