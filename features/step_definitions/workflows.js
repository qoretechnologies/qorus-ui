module.exports = function workflowSteps() {
  this.When(/^I activate "([^"]*)" navigation item$/, function(name) {
    const link = this.browser.
      queryAll('nav.side-menu li > a').
      find(link => (
        this.browser.query('.side-menu__text', link).textContent === name
      ));

    return this.browser.clickLink(link);
  });


  this.Then(/^I should see workflows listing$/, async function() {
    await this.changes();

    this.browser.assert.url({ pathname: '/workflows' });
    this.browser.assert.text('title', /^Workflows \| /);
  });


  this.Given(/^I am on workflows listing$/, function() {
    return this.browser.visit('/workflows');
  });


  const mainSection = '.root__center > section';
  const wflwTable = `${mainSection} table`;
  const wflwLoader = `${mainSection} p`;


  this.Given(/^there are no workflows loaded$/, function() {
    this.browser.assert.elements(wflwTable, 0);
  });


  this.Then(/^I should see a loader$/, function() {
    this.browser.assert.text(wflwLoader, 'Loading');
  });


  this.When(/^workflows get loaded$/, function() {
    return this.waitForElement(wflwTable);
  });


  const wflwRows = `${wflwTable} > tbody > tr`;


  this.Then(/^I should see a table with workflows data$/, function() {
    this.browser.assert.elements(wflwRows, { atLeast: 1 });
  });


  function findWorkflowRow(browser, name) {
    return browser.
      queryAll(wflwRows).
      find(r => r.cells[5].textContent === name);
  }


  this.When(/^I activate "([^"]*)" workflow$/, async function(name) {
    await this.waitForElement(wflwTable);

    await this.browser.click(findWorkflowRow(this.browser, name));

    this.workflowName = name;
  });


  const pane = `${wflwTable} ~ .pane`;
  const wflwPane = `${pane} .wflw`;


  this.Then(/^I should see workflow detail pane$/, async function() {
    await this.waitForElement(wflwPane);

    this.browser.assert.element(wflwPane);
  });


  this.Then(/^I should see workflow details tab$/, async function() {
    await this.waitForElement(wflwPane);

    this.browser.assert.text(
      `${wflwPane} h3`,
      new RegExp(`^${this.workflowName}\\b`)
    );
    this.browser.assert.text(
      `${wflwPane} .wflw__tabs > ul.nav > li.active`,
      'Detail'
    );
  });


  this.Then(/^I should see activated row highlighted$/, async function() {
    await this.waitForElement(wflwPane);

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


  this.When(/^I click close button on detail pane$/, async function() {
    await this.waitForElement(pane);

    await this.browser.pressButton(`${pane} .pane__close`);
  });


  this.Then(/^I should see no detail pane$/, function() {
    this.browser.assert.elements(pane, 0);
  });


  this.Then(/^I should see no row highlighted$/, async function() {
    await this.waitForElement(wflwTable);

    this.browser.assert.hasNoClass(
      findWorkflowRow(this.browser, this.workflowName),
      'info'
    );
  });
};
