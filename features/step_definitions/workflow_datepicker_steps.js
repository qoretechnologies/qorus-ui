import { findElementByText } from './common_steps';

const getDate = (type) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const date = new Date();
  const month = type === 'next' ? months[date.getMonth() + 1] : months[date.getMonth() - 1];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

module.exports = function workflowDatepickerSteps() {
  this.When(/^I click the datepicker input$/, async function() {
    return this.browser.click('.datepicker-group input');
  });

  this.Then(/^the datepicker is shown$/, async function() {
    this.browser.assert.element('.datepicker');
  });

  this.Given(/^datepicker is opened$/, async function() {
    await this.waitForElement('.datepicker-group');
    this.browser.click('.datepicker-group input');
    this.browser.assert.element('.datepicker');
  });

  this.When(/^I click on the "([^"]*)" month arrow$/, async function(month) {
    if (month === 'next') {
      return this.browser.click('.datepicker th:last-child');
    } else {
      return this.browser.click('.datepicker th:first-child');
    }
  });

  this.Then(/^the month should change to "([^"]*)"$/, async function(month) {
    const el = findElementByText(this.browser, 'th', getDate(month));

    this.browser.assert.element(el);
  });

  this.When(/^I click on the header$/, async function() {
    this.browser.click('.navbar-header');
  });

  this.Then(/^the datepicker is hidden$/, async function() {
    this.browser.assert.elements('.datepicker', 0);
  });

  this.Then(/^today should be highlighted$/, async function() {
    const date = new Date();
    const el = findElementByText(this.browser, '.today', date.getDate().toString());

    this.browser.assert.element(el);
  });

  this.Then(/^yesterday should be selected$/, async function() {
    const date = new Date();
    const el = findElementByText(this.browser, '.active', (date.getDate() - 1).toString());

    this.browser.assert.element(el);
  });
};
