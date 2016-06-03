import { findTableRow } from './common_steps';

module.exports = function orderDetailSteps() {
  this.Given(/^I click on the "([^"]*)" order$/, async function(order) {
    const row = findTableRow(this.browser, order);
    const el = row.cells[5].children[0];

    return this.browser.click(el);
  });

  this.Given(/^I am on order "([^"]*)"$/, async function(order) {
    return this.browser.visit(`/order/${order}`);
  });

  this.Then(/^there are "([^"]*)" action buttons$/, async function(count) {
    return this.browser.assert.elements('.order-actions button', parseInt(count, 10));
  });

  this.Then(/^"([^"]*)" action is disabled$/, async function(count) {
    return this.browser.assert.elements('.order-actions button[disabled]', parseInt(count, 10));
  });

  this.Given(/^the header gets loaded$/, async function() {
    await this.waitForElement('h3.detail-title');
    await this.waitForElement('ul.nav-tabs');
    await this.waitForElement('.order-actions');
  });
};
