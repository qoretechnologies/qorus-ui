import { findTableRow, findElementByText } from './common_steps';

module.exports = function groupsSteps() {
  this.Given(/^the group header gets loaded$/, async function() {
    await this.waitForElement('.detail-title');
  });

  this.When(/^I click the enable\-disable button$/, async function() {
    await this.browser.pressButton('.group-detail-controls button');
  });

  this.Then(/^the group is "([^"]*)"$/, async function(type) {
    if (type === 'enabled') {
      return this.browser.assert.element('.group-detail-controls button.btn-success');
    }

    return this.browser.assert.element('.group-detail-controls button.btn-danger');
  });

  this.Then(/^^(\d+) "([^"]*)" are loaded$/, async function(count, arg2) {
    this.browser.assert.elements('.container-fluid table', parseInt(count, 10));
  });
};
