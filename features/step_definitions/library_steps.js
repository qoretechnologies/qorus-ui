import { findTableRow } from './common_steps';

module.exports = function searchSteps() {
  this.Then(/^library gets loaded$/, async function() {
    await this.waitForElement('#search');
    await this.waitForElement('.constants-table');
    await this.waitForElement('.functions-table');
    await this.waitForElement('.classes-table');
  });

  this.When(/^I click on the "([^"]*)" constant$/, async function(name) {
    await this.waitForChange(2000);
    const row = findTableRow(this.browser, name, 0);
    return this.browser.click(row);
  });

  this.Then(/^the "([^"]*)" row is highlighted$/, async function(name) {
    const row = findTableRow(this.browser, name, 0);

    this.browser.assert.className(row, 'info');
  });

  this.Then(/^I see the source code$/, async function() {
    this.browser.assert.text('.pane-lib__src h4', 'TestConstants1 1.0');
    this.browser.assert.text('.pane-lib__src .source-code pre code', 'const t1 = 1;');
  });
};
