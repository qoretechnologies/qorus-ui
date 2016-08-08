import { findTableRow, findElementByText } from './common_steps';

module.exports = function systemSteps() {
  this.Then(/^properties get loaded$/, async function() {
    await this.waitForElement('.props-table');

    this.browser.assert.elements('.props-table', 2);
  });

  this.Then(/^there are "([^"]*)" props with "([^"]*)" keys$/, async function(props, rows) {
    this.browser.assert.elements('.props-table', parseInt(props, 10));
    this.browser.assert.elements('.props-table tr', parseInt(rows, 10));
  });

  this.Then(/^chart gets loaded$/, async function() {
    this.waitForElement('.chart-view canvas');

    this.browser.assert.element('.chart-view canvas');
  });

  this.Then(/^the health says "([^"]*)"$/, async function(text) {
    this.browser.assert.text('.health-info', text);
  });

  this.When(/^I activate "([^"]*)" alert$/, async function(name) {
    await this.browser.click(findTableRow(this.browser, name, 2));
  });

  this.Then(/^I should see the "([^"]*)" detail pane$/, async function(name) {
    this.browser.assert.element('.pane.right');
    this.browser.assert.element('.pane.right .table--info');

    const el = findElementByText(this.browser, '.pane.right .table--info td span', name);

    this.browser.assert.element(el);
  });

  this.Then(/^I cannot edit any options$/, async function() {
    this.browser.assert.elements('.options-edit', 0);
  });
};
