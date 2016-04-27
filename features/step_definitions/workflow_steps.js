import { expect } from 'chai';

import { findElementByText, selectors, findTableRow, findTableRowId } from './common_steps';


const wflwRowControls = 'td:nth-child(2) > .btn-controls > button.btn';
const wflwPaneContent = `${selectors.pane} .wflw`;


module.exports = function workflowSteps() {
  this.Then(/^I should see workflows listing$/, async function() {
    await this.changes();

    this.browser.assert.url({ pathname: '/workflows' });
    this.browser.assert.text('title', /^Workflows \| /);
  });


  this.Given(/^there are no workflows loaded$/, function() {
    this.browser.assert.elements(selectors.cmpTable, 0);
  });


  this.When(/^workflows get loaded$/, function() {
    return this.waitForElement(selectors.cmpTable);
  });


  this.Then(/^I should see a table with workflows data$/, function() {
    this.browser.assert.elements(selectors.cmpRows, { atLeast: 1 });
  });


  this.When(/^I activate "([^"]*)" workflow$/, async function(name) {
    await this.waitForElement(selectors.cmpTable);

    await this.browser.click(findTableRow(this.browser, name));

    this.detail = {
      id: findTableRowId(this.browser, name),
      name,
    };
  });


  this.Then(/^I should see workflow detail pane$/, async function() {
    await this.waitForElement(wflwPaneContent);

    this.browser.assert.element(wflwPaneContent);
  });


  this.Then(/^I should see workflow details tab$/, async function() {
    await this.waitForElement(wflwPaneContent);

    this.browser.assert.text(
      `${wflwPaneContent} h3`,
      new RegExp(`^${this.detail.name}\\b`)
    );
    this.browser.assert.text(
      `${wflwPaneContent} .wflw__tabs > ul.nav > li.active`,
      'Detail'
    );
  });


  this.Given(/^I have "([^"]*)" workflow open$/, async function(name) {
    await this.waitForElement(selectors.cmpTable);

    await this.browser.click(findTableRow(this.browser, name));

    this.detail = {
      id: findTableRowId(this.browser, name),
      name,
    };
  });


  this.When(/^I click close button on workflow detail pane$/, async function() {
    await this.waitForElement(selectors.pane);

    await this.browser.pressButton(`${selectors.pane} .pane__close`);
  });


  this.Then(/^I should see no workflow detail pane$/, function() {
    this.browser.assert.elements(selectors.pane, 0);
  });

  this.Given(/^I select the "([^"]*)" workflow$/, async function(name) {
    const el = findElementByText(this.browser, 'td', name).parentElement.children[0].children[0];

    await this.browser.click(el);
  });

};
