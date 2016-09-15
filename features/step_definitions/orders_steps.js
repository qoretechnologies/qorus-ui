import { findTableRow, findElementByText, selectors } from './common_steps';
import { expect } from 'chai';
import moment from 'moment';

const stateCells = {
  COMPLETE: 7,
  READY: 8,
  SCHEDULED: 9,
  INCOMPLETE: 10,
  'EVENT-WAITING': 11,
  'ASYNC-WAITING': 12,
  WAITING: 13,
  RETRY: 14,
  ERROR: 15,
  'IN-PROGRESS': 16,
  CANCELED: 17,
  BLOCKED: 18,
  TOTAL: 19,
};

module.exports = function orderSteps() {
  this.When(/^I click the "([^"]*)" cell on "([^"]*)"$/, async function(state, workflow) {
    const row = findTableRow(this.browser, workflow);
    const el = row.cells[stateCells[state]].children[0];

    this.browser.click(el);
  });

  this.Then(/^I should see workflow detail page$/, async function() {
    await this.changes();

    const url = this.browser.location.href.split('/');

    expect(url).to.be.an('array');
    expect(url[3]).to.equal('workflow');
    expect(url[4]).to.equal('14');
    expect(url[5]).to.equal('list');
    expect(url[6]).to.equal('All');
  });

  this.Given(/^I am on "([^"]*)" with "([^"]*)" states and "([^"]*)" dates$/, async function(workflow, state, date) {
    await this.browser.visit('/workflows');
    await this.waitForElement('.root__center > section table');
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
