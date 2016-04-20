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
  this.When(/^I focus the datepicker input$/, async function() {
    return this.browser.focus('.datepicker-group input');
  });

  this.Then(/^the datepicker is shown$/, async function() {
    this.browser.assert.element('.datepicker');
  });

  this.Given(/^datepicker is opened$/, async function() {
    await this.browser.focus('.datepicker-group input');
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
    let el;

    if (month === 'next') {
      el = findElementByText(this.browser, 'th', getDate('next'));
    } else {
      el = findElementByText(this.browser, 'th', getDate('prev'));
    }

    console.log(el);

    this.browser.assert.element(el);
  });
};
