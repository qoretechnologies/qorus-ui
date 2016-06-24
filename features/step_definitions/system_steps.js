module.exports = function systemSteps() {
  this.Then(/^properties get loaded$/, async function() {
    await this.waitForElement('.props-table');

    this.browser.assert.elements('.props-table', 2);
  });

  this.Then(/^there are "([^"]*)" props with "([^"]*)" keys$/, async function(props, rows) {
    this.browser.assert.elements('.props-table', parseInt(props, 10));
    this.browser.assert.elements('.props-table tr', parseInt(rows, 10));
  });
};
