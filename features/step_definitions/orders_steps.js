import { findTableRow, findElementByText, selectors } from './common_steps';
import { expect } from 'chai';
import moment from 'moment';

const stateCells = {
  COMPLETE: 9,
  READY: 10,
  SCHEDULED: 11,
  INCOMPLETE: 12,
  'EVENT-WAITING': 13,
  'ASYNC-WAITING': 14,
  WAITING: 15,
  RETRY: 16,
  ERROR: 17,
  'IN-PROGRESS': 18,
  CANCELED: 19,
  BLOCKED: 20,
  TOTAL: 21,
};

module.exports = function orderSteps() {
  this.When(/^I click the "([^"]*)" cell on "([^"]*)"$/, async function(state, workflow) {
    const row = findTableRow(this.browser, workflow);
    const el = row.cells[stateCells[state]].children[0];

    this.browser.click(el);
  });

  this.Then(/^I should see workflow detail page$/, async function() {
    await this.changes();

    this.browser.assert.url({ pathname: '/workflow/14/list' });
    this.browser.assert.url({ query: { date: '24h' } });
  });

  this.Given(/^I am on "([^"]*)" with "([^"]*)" states and "([^"]*)" dates$/, async function(workflow, state, date) {
    await this.browser.visit('/workflows');
    await this.waitForElement('.root__center > section table');
    await this.browser.pressButton(findElementByText(this.browser, 'button', ' Expand states'));

    const row = findTableRow(this.browser, workflow);
    const el = row.cells[stateCells[state]].children[0];

    if (date !== 'default') {
      const dt = new Date(date);

      if (moment(dt).isValid()) {
        this.browser.fill('.datepicker-group input[type="text"]', date);
        this.keyUp('.datepicker-group input[type="text"]', 13);
      } else {
        let btn;

        if (date === 'All') {
          btn = findElementByText(this.browser, '.btn', ' All');
        } else {
          this.browser.pressButton('#date-selection');
          btn = findElementByText(this.browser, '#date-selection-dropdown a', ` ${date}`);
        }

        this.browser.click(btn);

        await this.waitForChange(1000);
      }
    }

    this.browser.click(el);
  });

  this.Then(/^there are "([^"]*)" badges shown$/, async function(count) {
    this.browser.assert.elements('div.states span.badge', parseInt(count, 10));
  });

  this.Then(/^there are "([^"]*)" groups shown$/, async function(count) {
    this.browser.assert.elements('div.groups span.group', parseInt(count, 10));
  });

  this.When(/^I click the "([^"]*)" tab$/, async function(name) {
    await this.waitForElement('section .nav');

    const tab = findElementByText(this.browser, '.nav a', name);

    this.browser.click(tab);

    await this.waitForChange(1000);
  });

  this.Then(/^I should see the performance content$/, async function() {
    const url = this.browser.location.href.split('/');

    expect(url[5]).to.equal('performance');
  });

  this.Then(/^I should see the log content$/, async function() {
    const url = this.browser.location.href.split('/');

    expect(url[5]).to.equal('log');
    this.browser.assert.element('.log-area');
  });

  this.Then(/^I should see the info content$/, async function() {
    const url = this.browser.location.href.split('/');

    expect(url[5]).to.equal('info');
    this.browser.assert.element('.table--info');
  });

  this.Given(/^I select "([^"]*)" order with "([^"]*)" status$/, async function(count, state) {
    const row = this.browser.queryAll(
      `${selectors.mainSection} tbody > tr`
    ).filter(
      r => r.cells[3].textContent === state
    );

    for (let i = 0; i <= count - 1; i++) {
      this.browser.click(row[i].cells[0].children[0]);
    }
  });

  this.Then(/^there should be "([^"]*)" order with "([^"]*)" status$/, async function(count, state) {
    await this.waitForChange(2000);

    const els = this.browser.queryAll('td > span.label').filter(s => s.textContent === state);

    this.browser.assert.elements(els, parseInt(count, 10));
  });
};
