import { findElementByText } from './common_steps';

module.exports = function workFlowControlSteps() {
  this.When(/^I click the dropdown toggle$/, async function () {
    await this.waitForElement('#selection');
    return this.browser.pressButton('#selection');
  });

  this.Then(/^the dropdown should be shown$/, function () {
    this.browser.assert.element('#selection-dropdown');
  });

  this.When(/^I blur the dropdown toggle$/, function () {
    return this.browser.pressButton('#selection');
  });

  this.Then(/^the dropdown should be hidden$/, function () {
    this.browser.assert.elements('#selection-dropdown', 0);
  });

  this.When(/^I click the checkbox on the dropdown$/, function () {
    this.browser.click('#selection .fa-square-o');
  });

  this.Then(/^all of the workflows are selected$/, function () {
    this.browser.assert.hasClass('td.narrow > i', 'fa-check-square-o');
  });

  this.When(/^I select one workflow$/, function () {
    this.browser.click('td.narrow > i.fa-square-o:first-of-type');
  });

  this.Then(/^the dropdown checkbox should be halfchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-minus-square-o');
  });

  this.When(/^I click the "([^"]*)" item$/, function (item) {
    const el = findElementByText(this.browser, '#selection-dropdown > li > a', ` ${item}`);

    return this.browser.click(el);
  });

  this.Then(/^no workflows are selected$/, function () {
    this.browser.assert.hasClass('td.narrow > i', 'fa-square-o');
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.Then(/^the selection actions are displayed$/, function () {
    this.browser.assert.element('#selection-actions');
  });

  this.When(/^I deselect all workflows$/, function () {
    this.browser.click('td.narrow > i.fa-check-square-o');
  });

  this.Then(/^the dropdown checkbox should be unchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.When(/^I click the "([^"]*)" button inside "([^"]*)" dropdown$/, async function(button, dropdown) {
    this.browser.pressButton(`#${dropdown}`);

    const el = findElementByText(this.browser, `#${dropdown}-dropdown span`, button);

    this.browser.click(el);

    await this.waitForChange(4000);
  });

  this.When(/^I type "([^"]*)" in the search input$/, async function(search) {
    this.browser.fill('#search', search);
    this.browser.pressButton('#search-form [type="submit"]');
  });

  this.Then(/^"([^"]*)" workflows are shown$/, async function(workflows) {
    await this.waitForChange(1000);
    this.browser.assert.elements('tbody > tr', parseInt(workflows));
  });
};
