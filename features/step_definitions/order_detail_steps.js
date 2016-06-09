import { selectors, findTableRow, findElementByText } from './common_steps';

module.exports = function orderDetailSteps() {
  this.Given(/^I click on the "([^"]*)" order$/, async function(order) {
    const row = findTableRow(this.browser, order);
    const el = row.cells[5].children[0];

    return this.browser.click(el);
  });

  this.Given(/^I am on order "([^"]*)"$/, async function(order) {
    return this.browser.visit(`/order/${order}`);
  });

  this.Given(/^I am on order "([^"]*)" and "([^"]*)" tab$/, async function(order, name) {
    await this.browser.visit(`/order/${order}`);

    await this.waitForElement('.nav-tabs');

    const tab = findElementByText(this.browser, '.nav-tabs a', name);

    this.browser.click(tab);

    await this.waitForChange(1000);
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

  // STEPS
  this.Given(/^I click on the "([^"]*)" step$/, async function(step) {
    const row = this.browser.
      queryAll(selectors.cmpRows).
      find(r => r.cells[2].textContent === step) || null;

    return this.browser.click(row);
  });

  this.Then(/^I should see "([^"]*)" subtabs$/, async function(count) {
    return this.browser.assert.elements('.tab-pane .nav-pills li', parseInt(count, 10));
  });

  this.Then(/^I should see the "([^"]*)" data$/, async function(data) {
    const el = findElementByText(this.browser, '.tab-pane .nav-pills li.active', data);

    this.browser.assert.element(el);
    this.browser.assert.element('.tree-wrapper');
    this.browser.assert.element('.button--copy');
  });
};
