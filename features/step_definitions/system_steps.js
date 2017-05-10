import { findTableRow, findElementByText, findTableRowId } from './common_steps';

module.exports = function systemSteps() {
  this.Then(/^properties get loaded$/, async function() {
    await this.waitForElement('table');

    this.browser.assert.elements('table', 2);
  });

  this.Then(/^there are "([^"]*)" props with "([^"]*)" keys$/, async function(props, rows) {
    this.browser.assert.elements('table', parseInt(props, 10));
    this.browser.assert.elements('table > tbody > tr', parseInt(rows, 10));
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

  this.When(/^I activate "([^"]*)" valuemap$/, async function(name) {
    await this.browser.click(findTableRow(this.browser, name, 0));

    this.detail = {
      id: findTableRowId(this.browser, name, 0),
      name,
    };
  });

  this.When(/^I click the first "([^"]*)" button$/, async function(button) {
    const el = findElementByText(this.browser, '.btn', ` ${button}`);
    await this.browser.pressButton(el[0]);
  });

  this.When(/^I click the first button with "([^"]*)" selector$/, async function(buttonSelector) {
    const selector = `${buttonSelector}.btn`;
    await this.waitForElement(selector);
    const el = this.browser.queryAll(selector);
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

  this.When(/^the log loads$/, async function() {
    await this.waitForElement('pre');
  });

  this.Then(/^the log should contain "([^"]*)" after (\d+) seconds$/, async function(data, seconds) {
    await this.waitForChange(seconds * 1000);

    this.browser.assert.text(this.browser.queryAll('code')[0], data);
  });

  this.When(/^I wait some time$/, async function() {
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  this.Then(/^there should be (\d+) related object links$/, async function(count) {
    return this.browser.assert.elements('.alert-pane-object', parseInt(count, 10));
  });

  this.Then(/^the time says "([^"]*)" and alertid is "([^"]*)"$/, async function(when, alertId) {
    const time = this.browser.queryAll('.pane__content table tr')[5].cells[1];
    const alert = this.browser.queryAll('.pane__content table tr')[2].cells[1];

    this.browser.assert.text(time, when);
    this.browser.assert.text(alert, alertId);
  });

  this.When(/^I click on the "([^"]*)" header$/, async function(name) {
    const el = findElementByText(this.browser, 'h4', ` ${name}`);

    this.browser.click(el);
  });
};
