import { selectors, findTableRow, findElementByText } from './common_steps';
import { expect } from 'chai';

module.exports = function orderDetailSteps() {
  this.Given(/^I click on the "([^"]*)" order$/, async function(order) {
    const row = findTableRow(this.browser, order);
    const el = row.cells[5].children[0];

    return this.browser.click(el);
  });

  this.Given(/^I am on order "([^"]*)"$/, async function(order) {
    return this.browser.visit(`/order/${order}/19700101000000`);
  });

  this.Given(/^I am on order "([^"]*)" and "([^"]*)" tab$/, async function(order, name) {
    await this.browser.visit(`/order/${order}/19700101000000`);

    await this.waitForElement('.nav-tabs');

    const tab = findElementByText(this.browser, '.nav-tabs a', name);

    this.browser.click(tab);

    await this.waitForChange(1000);
  });

  this.Then(/^there are "([^"]*)" action buttons$/, async function(count) {
    return this.browser.assert.elements('.order-actions button', parseInt(count, 10));
  });

  this.Then(/^"([^"]*)" action is disabled$/, async function(count) {
    return this.browser.assert.elements('.order-actions button[disabled]', parseInt(count, 10));
  });

  this.Given(/^the header gets loaded$/, async function() {
    await this.waitForElement('h3.detail-title');
    await this.waitForElement('ul.nav-tabs');
    await this.waitForElement('.order-actions');
  });

  // STEP
  this.Then(/^I should see "([^"]*)" subtabs$/, async function(count) {
    return this.browser.assert.elements('.tab-pane .nav-pills li', parseInt(count, 10));
  });

  this.Then(/^I should see the "([^"]*)" data$/, async function(data) {
    const el = findElementByText(this.browser, '.tab-pane .nav-pills li.active', data);

    this.browser.assert.element(el);
    this.browser.assert.element('.tree-wrapper');
    this.browser.assert.element('.button--copy');
  });

  this.Then(/^there should be a textarea with the data$/, async function() {
    this.browser.assert.element('textarea');
  });

  this.Given(/^notes get loaded$/, async function() {
    await this.waitForElement('#notes-wrapper');

    return this.browser.assert.element('#notes-wrapper');
  });

  this.Then(/^there are "([^"]*)" notes$/, async function(count) {
    return this.browser.assert.elements('p.note', parseInt(count, 10));
  });

  this.When(/^I add a new note "([^"]*)"$/, async function(note) {
    this.browser.fill('#notes-wrapper textarea', note);

    const el = findElementByText(this.browser, '.btn', ' Add note');

    this.browser.click(el);
    await this.waitForChange(500);
  });

  this.Then(/^the last note says "([^"]*)"$/, async function(note) {
    const notes = this.browser.queryAll('p.note');

    expect(notes[0].children[2].textContent).to.equal(note);
    expect(notes[0].children[1].textContent).to.equal('admin');
  });

  this.Given(/^diagram gets loaded$/, async function() {
    await this.waitForElement('svg.diagram');
  });
};
