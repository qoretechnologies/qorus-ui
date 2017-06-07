import { findElementByText } from './common_steps';

module.exports = function searchSteps() {
  this.Then(/^library gets loaded$/, async function() {
    await this.waitForElement('#search');
    await this.waitForElement('.code-item');
  });

  this.When(/^I click on the "([^"]*)" constant$/, async function(name) {
    const el = findElementByText(this.browser, '.code-item', name);

    return this.browser.click(el);
  });

  this.Then(/^the "([^"]*)" row is highlighted$/, async function(name) {
    await this.waitForChange(500);

    this.browser.assert.elements('.code-item.selected', 1);
  });

  this.Then(/^I see the source code$/, async function() {
    this.browser.assert.text('.code-source h5', 'Constants - testconstants1 v1.0 (1)');
    this.browser.assert.text('code', 'const t1 = 1;');
  });

  this.Then(/^(\d+) library items are shown$/, async function(count) {
    this.browser.assert.elements('.code-item', parseInt(count, 10));
  });
};
