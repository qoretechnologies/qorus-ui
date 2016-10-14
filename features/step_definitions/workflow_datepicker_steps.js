import { findElementByText, findElementByValue } from './common_steps';
import moment from 'moment';

const getMonthByDate = (type, date = new Date()) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

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
    const yesterday = moment(new Date()).subtract(1, 'day').toDate();
    const el = findElementByText(this.browser, 'th', getMonthByDate(month, yesterday));

    this.browser.assert.element(el);
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
    const yesterday = moment(date).subtract(1, 'day').toDate();
    console.log(yesterday.getDate());
    const el = findElementByText(this.browser, '.active', (yesterday.getDate()).toString());

    this.browser.assert.element(el);
  });

  this.Given(/^I change hours and minutes$/, async function() {
    const date = moment();
    this.hours = date.hours();
    this.minutes = date.minutes();

    this.browser.fill('.datepicker [name="hours"]', 0);
    this.browser.fill('.datepicker [name="minutes"]', 0);
  });

  this.When(/^I click the reset button$/, async function() {
    return this.browser.click('.hours .fa-times');
  });

  this.Then(/^hours and change should return to the default value$/, async function() {
    const hours = findElementByValue(
      this.browser, '.datepicker [name="hours"]', this.hours.toString()
    );
    const minutes = findElementByValue(
      this.browser, '.datepicker [name="minutes"]', this.minutes.toString()
    );

    this.browser.assert.element(hours);
    this.browser.assert.element(minutes);
  });

  this.When(/^I change the input to "([^"]*)"$/, async function(date) {
    this.browser.fill('.datepicker-group input[type="text"]', date);
    this.keyUp('.datepicker-group input[type="text"]', 13);
  });

  this.Then(/^the query "([^"]*)" changes to "([^"]*)"$/, async function(qn, q) {
    await this.waitForURLChange();

    this.browser.assert.url({ query: { [qn]: q } });
  });

  this.Then(/^the URL does not change$/, async function() {
    this.browser.assert.url({ pathname: '/workflows' });
  });
};
