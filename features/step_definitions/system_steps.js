import { findTableRow, findElementByText, findTableRowId } from './common_steps';

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

  this.When(/^I activate "([^"]*)" connection$/, async function(name) {
    await this.browser.click(findTableRow(this.browser, name, 2));

    this.detail = {
      id: findTableRowId(this.browser, name, 2),
      name,
    };
  });

  this.When(/^I click the first "([^"]*)" button$/, async function(button) {
    const el = findElementByText(this.browser, '.btn', ` ${button}`);
    await this.browser.pressButton(el[0]);
  });

  this.When(/^I clear the "([^"]*)" cache$/, async function(name) {
    const row = findTableRow(this.browser, name, 0);

    await this.browser.pressButton(row.cells[3].children[0]);
  });

  this.Then(/^there should be a button to add new "([^"]*)"$/, async function(button) {
    const el = findElementByText(this.browser, '.btn', ` Add ${button}`);

    this.browser.assert.element(el);
  });

  this.Then(/^there should not be a button to add new "([^"]*)"$/, async function(button) {
    const el = findElementByText(this.browser, '.btn', ` Add ${button}`);

    this.browser.assert.elements(el, 0);
  });

  this.When(/^I delete the "([^"]*)" "([^"]*)"$/, async function(name, type) {
    const cellId = type === 'role' ? 1 : 2;
    const row = findTableRow(this.browser, name, cellId);

    this.browser.pressButton(row.cells[0].children[0].children[1]);
  });

};
