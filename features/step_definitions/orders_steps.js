import { findTableRow } from './common_steps';
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

};
