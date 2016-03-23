const { selectors } = require('./common_steps');


const wflwTable = `${selectors.mainSection} table`;
const wflwRows = `${wflwTable} > tbody > tr`;
const wflwPane = `${wflwTable} ~ .pane`;
const wflwPaneContent = `${wflwPane} .wflw`;


/**
 * Finds workflow row by worflow name.
 *
 * @param {Zombie} browser
 * @param {string} name
 * @return {?HTMLTableRowElement}
 */
function findWorkflowRow(browser, name) {
  return browser.
    queryAll(wflwRows).
    find(r => r.cells[5].textContent === name) || null;
}


module.exports = function workflowSteps() {
  this.Then(/^I should see workflows listing$/, async function() {
    await this.changes();

    this.browser.assert.url({ pathname: '/workflows' });
    this.browser.assert.text('title', /^Workflows \| /);
  });


  this.Given(/^I am on workflows listing$/, function() {
    return this.browser.visit('/workflows');
  });


  this.Given(/^there are no workflows loaded$/, function() {
    this.browser.assert.elements(wflwTable, 0);
  });


  this.When(/^workflows get loaded$/, function() {
    return this.waitForElement(wflwTable);
  });


  this.Then(/^I should see a table with workflows data$/, function() {
    this.browser.assert.elements(wflwRows, { atLeast: 1 });
  });


  this.When(/^I activate "([^"]*)" workflow$/, async function(name) {
    await this.waitForElement(wflwTable);

    await this.browser.click(findWorkflowRow(this.browser, name));

    this.workflowName = name;
  });


  this.Then(/^I should see workflow detail pane$/, async function() {
    await this.waitForElement(wflwPaneContent);

    this.browser.assert.element(wflwPaneContent);
  });


  this.Then(/^I should see workflow details tab$/, async function() {
    await this.waitForElement(wflwPaneContent);

    this.browser.assert.text(
      `${wflwPaneContent} h3`,
      new RegExp(`^${this.workflowName}\\b`)
    );
    this.browser.assert.text(
      `${wflwPaneContent} .wflw__tabs > ul.nav > li.active`,
      'Detail'
    );
  });


  this.Then(/^I should see activated row highlighted$/, async function() {
    await this.waitForElement(wflwPaneContent);

    this.browser.assert.text(
      `${wflwRows}.info td:nth-child(6)`,
      this.workflowName
    );
  });


  this.Given(/^I have "([^"]*)" workflow open$/, async function(name) {
    await this.waitForElement(wflwTable);

    await this.browser.click(findWorkflowRow(this.browser, name));

    this.workflowName = name;
  });


  this.When(/^I click close button on workflow detail pane$/, async function() {
    await this.waitForElement(wflwPane);

    await this.browser.pressButton(`${wflwPane} .pane__close`);
  });


  this.Then(/^I should see no workflow detail pane$/, function() {
    this.browser.assert.elements(wflwPane, 0);
  });


  this.Then(/^I should see no row highlighted$/, async function() {
    await this.waitForElement(wflwTable);

    this.browser.assert.hasNoClass(
      findWorkflowRow(this.browser, this.workflowName),
      'info'
    );
  });
};
