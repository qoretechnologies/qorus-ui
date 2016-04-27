const mainSection = '.root__center > section';
const cmpTable = `${mainSection} table`;
const cmpLoader = `${mainSection} p`;
const cmpRows = `${cmpTable} > tbody > tr`;
const pane = `${cmpTable} ~ .pane`;
const cmpPane = `${pane} article`;


/**
 * Finds listed object's row element by its name.
 *
 * @param {!module:zombie/Browser} browser
 * @param {string} name
 * @return {HTMLTableRowElement}
 */
function findTableRow(browser, name) {
  return browser.
    queryAll(cmpRows).
    find(r => r.cells[5].textContent === name) || null;
}


/**
 * Finds listed object's unique identifier by given name in table.
 *
 * @param {!module:zombie/Browser} browser
 * @param {string} name
 * @return {?number}
 */
function findTableRowId(browser, name) {
  const row = findTableRow(browser, name);
  if (!row) return null;

  const id = parseInt(row.cells[4].textContent, 10);

  return !isNaN(id) ? id : null;
}

const findElementByText = (browser, selector, text) => browser.queryAll(selector)
  .find(el => el.textContent === text) || null;

const findElementByValue = (browser, selector, text) => browser.queryAll(selector)
  .find(el => el.value === text) || null;

module.exports = function commonSteps() {
  this.When(/^I activate "([^"]*)" navigation item$/, function(name) {
    const link = this.browser.
      queryAll('nav.side-menu li > a').
      find(link => (
        this.browser.query('.side-menu__text', link).textContent === name
      ));

    return this.browser.clickLink(link);
  });

  this.Then(/^I should see "([^"]*)" listing$/, async function(name) {
    await this.changes();

    const title = name.charAt(0).toUpperCase() + name.slice(1);

    this.browser.assert.url({ pathname: `/${name}` });
    this.browser.assert.text('title', new RegExp(`^${title} \|`));
  });

  this.Given(/^I am on "([^"]*)" listing$/, function(name) {
    return this.browser.visit(`/${name}`);
  });


  this.Then(/^I should see a loader$/, function() {
    this.browser.assert.text(cmpLoader, 'Loading');
  });


  this.Then(/^I should see a table with "([^"]*)" data$/, function(name) {
    this.browser.assert.elements(cmpRows, { atLeast: 1 });
  });


  this.When(/^"([^"]*)" get loaded$/, function(name) {
    return this.waitForElement(cmpTable);
  });


  this.Given(/^there are no "([^"]*)" loaded$/, function(name) {
    this.browser.assert.elements(cmpTable, 0);
  });

  this.When(/^I click on the header$/, async function() {
    this.browser.click('.navbar-header');
  });

  this.When(/^I click the "([^"]*)" button$/, async function(button) {
    const el = findElementByText(this.browser, '.btn > span', ` ${button}`);

    return this.browser.click(el.parentElement);
  });

  this.When(/^I activate "([^"]*)"$/, async function(name) {
    await this.waitForElement(cmpTable);

    await this.browser.click(findTableRow(this.browser, name));

    this.detail = {
      id: findTableRowId(this.browser, name),
      name
    };
  });

  this.Then(/^I should see "([^"]*)" detail pane$/, async function(name) {
    await this.waitForElement(cmpPane);

    this.browser.assert.element(cmpPane);
  });


  this.Then(/^I should see "([^"]*)" details tab$/, async function(name) {
    await this.waitForElement(cmpPane);

    this.browser.assert.text(
      `${cmpPane} h3`,
      new RegExp(`^${this.detail.name}\\b`)
    );
    this.browser.assert.text(
      `${cmpPane} div[class$="__tabs"] > ul.nav > li.active`,
      'Detail'
    );
  });


  this.Then(/^I should see activated row highlighted$/, async function() {
    await this.waitForElement(cmpPane);

    this.browser.assert.text(
      `${cmpRows}.info td:nth-child(6)`,
      this.detail.name
    );
  });


  this.Given(/^I have "([^"]*)" open$/, async function(name) {
    await this.waitForElement(cmpTable);

    await this.browser.click(findTableRow(this.browser, name));

    this.detail = {
      id: findTableRowId(this.browser, name),
      name
    };
  });


  this.When(/^I click close button on detail pane$/, async function() {
    await this.waitForElement(pane);

    await this.browser.pressButton(`${pane} .pane__close`);
  });


  this.Then(/^I should see no detail pane$/, function() {
    this.browser.assert.elements(pane, 0);
  });


  this.Then(/^I should see no row highlighted$/, async function() {
    await this.waitForElement(cmpTable);

    this.browser.assert.hasNoClass(
      findTableRow(this.browser, this.detail.name),
      'info'
    );
  });
};

module.exports.selectors = {
  mainSection, cmpTable, cmpLoader, cmpRows,
  pane, cmpPane,
};
module.exports.findTableRow = findTableRow;
module.exports.findTableRowId = findTableRowId;
module.exports.findElementByText = findElementByText;
module.exports.findElementByValue = findElementByValue;
