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
    await this.waitForElement('.detail-title');
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

  this.Given(/^diagram, tables and error pane get loaded$/, async function() {
    await this.waitForElement('svg.diagram');

    this.browser.assert.elements('.order-info-view table', 2);
    this.browser.assert.element('.error-pane');
  });

  this.Then(/^the diagram has (\d+) boxes$/, async function(count) {
    return this.browser.assert.elements('.diagram .diagram__box', parseInt(count, 10));
  });

  this.Then(/^start box is "([^"]*)"$/, async function(css) {
    const el = this.browser.queryAll('.diagram__box')[0];

    this.browser.assert.className(el, `diagram__box diagram__box--${css}`);
  });

  this.Then(/^there are (\d+) "([^"]*)" boxes$/, async function(count, css) {
    return this.browser.assert.elements(`.diagram .diagram__box--${css}`, parseInt(count, 10));
  });

  this.When(/^I click the info icon on "([^"]*)"$/, async function(text) {
    const box = this.browser.queryAll('.diagram .diagram__box text').find(b => b.textContent === text);
    const el = box.parentNode.children[3];

    this.browser.click(el);

    await this.waitForChange(500);
  });

  this.Then(/^the step detail table is shown$/, async function() {
    this.browser.assert.elements('.order-info-view table', 3);
  });

  this.Then(/^I change the priority to (\d+)$/, async function(priority) {
    const table = this.browser.queryAll('.order-info-view table')[0];
    const cell = table.children[0].rows[2].cells[3];

    this.browser.click(cell);

    const input = cell.children[0].children[0];
    const submit = cell.children[0].children[1];

    this.browser.fill(input, priority);
    await this.browser.pressButton(submit);

    expect(input.value).to.equal('900');
  });

  this.Then(/^there are "([^"]*)" errors shown$/, async function(count) {
    this.browser.assert.elements('.error-pane table tbody tr', parseInt(count, 10));
  });

  this.When(/^I click on a row$/, async function() {
    const row = this.browser.queryAll('.error-pane table tbody tr')[0];

    this.browser.click(row);
  });

  this.Then(/^the the copy button is displayed$/, async function() {
    const cell = this.browser.queryAll('.error-pane table tbody tr')[1].cells[0];

    this.browser.assert.elements('.error-pane table tbody tr', 52);
    this.browser.assert.text(cell, 'Copy error');
  });
};
