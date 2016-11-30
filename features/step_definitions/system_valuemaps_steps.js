import { findElementByText, findTableRow } from './common_steps';

module.exports = function systemValuemapsSteps() {
  this.Given(/^values get loaded$/, async function() {
    await this.waitForElement('.pane__content table');
  });

  this.Then(/^"([^"]*)" values are shown$/, async function(count) {
    this.browser.assert.elements('.pane__content table > tbody > tr', parseInt(count, 10));
  });

  this.When(/^I change enabled of the "([^"]*)" value$/, async function(name) {
    const row = findTableRow(this.browser, name, 0);
    const button = row.cells[2].querySelector('.btn:first-child');

    this.browser.pressButton(button);
    await this.waitForChange(500);
  });

  this.Then(/^there are "([^"]*)" "([^"]*)" values$/, async function(count, type) {
    const css = type === 'enabled' ? 'success' : 'danger';

    // eslint-disable-next-line
    this.browser.assert.elements(`.pane__content table > tbody > tr > td .btn-group .btn-${css}`, parseInt(count, 10));
  });

  this.When(/^I delete the "([^"]*)" value$/, async function(name) {
    const row = findTableRow(this.browser, name, 0);
    const button = row.cells[2].querySelector('.btn:last-child');

    this.browser.pressButton(button);
    await this.waitForChange(500);
  });
};
