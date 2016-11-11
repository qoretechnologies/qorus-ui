import { findTableRow, findElementByText, selectors } from './common_steps';
import { expect } from 'chai';
import moment from 'moment';

const stateCells = {
  COMPLETE: 8,
  READY: 9,
  SCHEDULED: 10,
  INCOMPLETE: 11,
  'EVENT-WAITING': 12,
  'ASYNC-WAITING': 13,
  WAITING: 14,
  RETRY: 15,
  ERROR: 16,
  'IN-PROGRESS': 17,
  CANCELED: 18,
  BLOCKED: 19,
  TOTAL: 20,
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
