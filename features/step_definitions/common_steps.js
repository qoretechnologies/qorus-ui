const mainSection = '.root__center > section';
const cmpTable = `${mainSection} table`;
const cmpLoader = `${mainSection} p`;
const cmpRows = `${cmpTable} > tbody > tr`;
const pane = `${cmpTable} ~ .pane`;
const cmpPane = `${pane} article`;
const cmpForm = 'form';

/**
 * Finds listed object's row element by its name.
 *
 * @param {!module:zombie/Browser} browser
 * @param {string} name
 * @return {HTMLTableRowElement}
 */
function findTableRow(browser, name, cellId) {
  const cell = cellId === undefined ? 5 : cellId;

  return browser.
    queryAll(cmpRows).
    find(r => r.cells[cell].textContent === name) || null;
}

/**
 * Finds listed object's unique identifier by given name in table.
 *
 * @param {!module:zombie/Browser} browser
 * @param {string} name
 * @return {?number}
 */
function findTableRowId(browser, name, cellId) {
  const cell = cellId || 4;
  const row = findTableRow(browser, name, cellId);
  if (!row) return null;

  const id = parseInt(row.cells[cell].textContent, 10);

  return !isNaN(id) ? id : null;
}

const findElementByText = (browser, selector, text) => browser.queryAll(selector)
  .find(el => el.textContent === text) || null;

const findElementByValue = (browser, selector, text) => browser.queryAll(selector)
  .find(el => el.value === text) || null;

const instanceColumns = {
  job: {
    'in-progress': 10,
    error: 9,
    complete: 8,
  },
  workflow: {
    ready: 8,
    'in-progress': 16,
  },
};

module.exports = function commonSteps() {
  this.When(/^I activate "([^"]*)" navigation item$/, async function(name) {
    await this.waitForElement('nav.side-menu')
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

  this.Given(/^I am anonymous user$/, function() {
    this.token = null;
  });

  this.Given(/^I am user with fake token$/, function() {
    this.token = 'fake';
  });

  this.Given(/^I am on "([^"]*)" listing$/, async function(name) {
    return this.browser.visit(`/${name}`);
  });

  this.Given(/^Auth not required$/, function() {
    this.noauth = true;
  });

  this.Given(/^I am on "([^"]*)" page$/, function(name) {
    return this.browser.visit(`/${name}`);
  });


  this.Then(/^I should see a loader$/, async function() {
    await this.waitForElement('.root__center > section');
    this.browser.assert.text(cmpLoader, 'Loading...');
  });


  this.Then(/^I should see a table with "([^"]*)" data$/, function(name) {
    this.browser.assert.elements(cmpRows, { atLeast: 1 });
  });

  this.Then(/^I should see "([^"]*)" form$/, async function(name) {
    await this.waitForElement(`form.${name}`);
    this.browser.assert.elements(`form.${name}`, { atLeast: 1 });
  });

  this.Then(/^I see "([^"]*)" table rows$/, async function(rowCount) {
    await this.waitForChange(1000);
    this.browser.assert.elements(`${cmpTable} tbody tr`, { exactly: parseInt(rowCount, 10) });
  });

  this.When(/^"([^"]*)" get loaded$/, function(name) {
    return this.waitForElement(cmpTable);
  });

  this.When(/^"([^"]*)" item get loaded$/, function(name) {
    return this.waitForElement(name);
  });

  this.Given(/^there are no "([^"]*)" loaded$/, function(name) {
    this.browser.assert.elements(cmpTable, 0);
  });

  this.When(/^I click on the header$/, async function() {
    this.browser.click('.navbar-header');
  });

  this.When(/^I click the "([^"]*)" button$/, async function(button) {
    const el = findElementByText(this.browser, '.btn', ` ${button}`);
    await this.browser.click(el);
  });

  this.When(/^I click on "([^"]*)" item$/, async function(selector) {
    await this.waitForElement(mainSection);
    await this.waitForElement(selector);
    return this.browser.click(selector);
  });

  this.When(/^I activate "([^"]*)"$/, async function(name) {
    await this.waitForElement(cmpTable);

    await this.browser.click(findTableRow(this.browser, name));

    this.detail = {
      id: findTableRowId(this.browser, name),
      name,
    };
  });

  // TODO: Why is this "pane" in table??
  this.Then(/^I should see "([^"]*)" detail pane$/, async function(name) {
    await this.waitForElement(pane);

    this.browser.assert.element(pane);
  });

  this.Then(/^I should see detail pane$/, async function() {
    await this.waitForElement('.pane');

    this.browser.assert.element('.pane');
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
      name,
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

  this.When(/^I click on the "([^"]*)" column header$/, async function(header) {
    const el = findElementByText(this.browser, 'thead th', header);

    this.browser.click(el);
  });

  this.Then(/^all of the "([^"]*)" are selected$/, async function (wf) {
    this.browser.assert.hasClass('td.narrow.checker > i', 'fa-check-square-o');
  });

  this.When(/^I select one "([^"]*)"$/, function (wf) {
    this.browser.click('td.narrow > i.fa-square-o:first-of-type');
  });

  this.When(/^I deselect all "([^"]*)"$/, function (wf) {
    this.browser.click('td.narrow > i.fa-check-square-o');
  });

  this.Then(/^no "([^"]*)" are selected$/, function (wf) {
    this.browser.assert.hasClass('td.narrow.checker > i', 'fa-square-o');
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.Then(/^"([^"]*)" "([^"]*)" are selected$/, function (count, type) {
    this.browser.assert.elements('td.narrow.checker > i.fa-check-square-o', parseInt(count, 10));
  });

  this.When(/^I click the "([^"]*)" button inside "([^"]*)" dropdown$/, async function(button, dropdown) {
    await this.waitForElement(`#${dropdown}`);

    this.browser.pressButton(`#${dropdown}`);

    const el = findElementByText(this.browser, `#${dropdown}-dropdown span`, ` ${button}`);

    this.browser.click(el);

    await this.waitForChange(1000);
  });

  this.When(/^I click the "([^"]*)" item$/, async function(item) {
    const el = findElementByText(this.browser, '.dropdown-menu span', ` ${item}`);

    this.browser.click(el);
  });

  this.Then(/^"([^"]*)" "([^"]*)" are shown$/, async function(workflows, type) {
    await this.waitForChange(4000);
    this.browser.assert.elements(`${mainSection} tbody > tr`, parseInt(workflows, 10));
  });

  this.When(/^I select "([^"]*)" "([^"]*)"$/, async function (count, type) {
    const rows = this.browser.queryAll('td.narrow.checker > i.fa-square-o');

    for (let i = 0; i <= count - 1; i++) {
      this.browser.click(rows[i]);
    }
  });

  this.Then(/^there are "([^"]*)" "([^"]*)" "([^"]*)"$/, async function(count, type, data) {
    let el;
    let css;

    if (type === 'disabled' || type === 'enabled') {
      css = type === 'disabled' ? 'danger' : 'success';
      el = `td.narrow .btn-${css} i.fa-power-off`;
    } else if (type === 'loaded' || type === 'unloaded') {
      css = type === 'loaded' ? ' .btn-success' : '';
      const icon = type === 'loaded' ? 'check' : 'ban';
      el = `td.narrow${css} i.fa-${icon}`;
    } else if (type === 'active' || type === 'inactive') {
      css = type === 'active' ? ' .job-set-inactive' : ' .job-set-active';
      el = `td.narrow${css}`;
    }

    await this.waitForChange(1000);
    this.browser.assert.elements(el, parseInt(count, 10));
  });

  this.When(/^I click the dropdown toggle$/, async function () {
    await this.waitForElement('#selection');
    return this.browser.pressButton('#selection');
  });

  this.Then(/^the dropdown should be shown$/, function () {
    this.browser.assert.element('#selection-dropdown');
  });

  this.Then(/^the dropdown should be hidden$/, function () {
    this.browser.assert.elements('#selection-dropdown', 0);
  });

  this.When(/^I click the checkbox on the dropdown$/, async function () {
    return this.browser.click('#selection .fa-square-o');
  });

  this.Then(/^the dropdown checkbox should be halfchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-minus-square-o');
  });

  this.Then(/^the selection actions are displayed$/, function () {
    this.browser.assert.element('#selection-actions');
  });

  this.Then(/^the dropdown checkbox should be unchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.When(/^I type "([^"]*)" in the search input$/, async function(search) {
    await this.waitForElement('#search');
    this.browser.fill('#search', search);
    return this.browser.pressButton('#search-form [type="submit"]');
  });

  this.When(/^I type "([^"]*)" in "([^"]*)" input$/, async function(text, input) {
    await this.waitForElement(`[name=${input}]`);
    this.browser.fill(input, text);
  });

  this.When(/^I submit "([^"]*)" form$/, async function(formClass) {
    return this.browser.pressButton(`form.${formClass} button[type=submit]`);
  });

  this.Then(/^I see "([^"]*)" alert$/, async function(alertType) {
    const elementName = `.alert-${alertType}`;
    await this.waitForElement(elementName);
    this.browser.assert.element(elementName);
  });

  this.Then(/^I see "([^"]*)" item$/, async function(selector) {
    await this.waitForElement(selector);
    this.browser.assert.element(selector);
  });

  this.Then(/^I see "([^"]*)" "([^"]*)" items$/, async function(count, selector) {
    await this.waitForElement(selector);
    console.log(parseInt(count, 10));
    this.browser.assert.elements(selector, { exactly: parseInt(count, 10) });
  });

  this.Then(/^I do not see "([^"]*)" item$/, async function(selector) {
    await this.waitForChange(1000);
    this.browser.assert.elements(selector, { exactly: 0 });
  });

  this.Then(/^I see modal$/, async function () {
    await this.waitForElement('.modal-root');
    await this.waitForElement('.modal');
    this.browser.assert.element('.modal');
  });

  this.Then(/^"([^"]*)" exists in localStorage$/, function(itemName) {
    const item = this.browser.window.localStorage.getItem(itemName);
    if (!item) {
      throw new Error(`${itemName} hasn't been set`);
    }
    this.browser.assert.success();
  });

  this.Then(/^I see modal with CSV data in it$/, async function () {
    await this.waitForElement('.modal');
    this.browser.assert.element('.modal');
  });

  this.Given(/^I click the "([^"]*)" date button$/, async function(btn) {
    const el = findElementByText(this.browser, '.btn', ` ${btn}`);

    await this.browser.pressButton(el);
  });

  this.Then(/^the header says "([^"]*)"$/, async function(name) {
    const el = findElementByText(this.browser, '.detail-title', name);

    this.browser.assert.element(el);
  });

  this.Then(/^there are "([^"]*)" tabs$/, async function(count) {
    await this.waitForElement('ul.nav-tabs');

    return this.browser.assert.elements('ul.nav-tabs li', parseInt(count, 10));
  });

  this.Given(/^I click on the "([^"]*)" row - "([^"]*)"$/, async function(name, nameCell) {
    const row = this.browser.
      queryAll(cmpRows).
      find(r => r.cells[parseInt(nameCell, 10)].textContent === name) || null;

    return this.browser.click(row);
  });

  this.Given(/^I click on the "([^"]*)" link - "([^"]*)"$/, async function(name, nameCell) {
    const row = this.browser.
      queryAll(cmpRows).
      find(r => r.cells[parseInt(nameCell, 10)].textContent === name) || null;

    return this.browser.click(row.cells[parseInt(nameCell, 10)].children[0]);
  });

  this.Then(/^the URL changes to "([^"]*)"$/, async function(pathname) {
    await this.waitForURLChange();

    this.browser.assert.url({ pathname });
  });

  this.Then(/^query param "([^"]*)" equals to "([^"]*)"$/, function(name, value) {
    this.browser.assert.url({ query: { [name]: value } });
  });

  this.Given(/^An old browser$/, function () {
    this.setupBrowser('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/5.0)');
  });

  this.Given(/^I am logged in as "([^"]*)" user$/, function(user) {
    this.token = `${user}tkn`;
  });

  this.Given(
    /^I send a ws request for "([^"]*)"$/,
    async function(event) {
      await this.browser.fetch(`/apievents/${event}`);
      await this.waitForChange(500);
    }
  );

  this.Given(
    /^I send a ws request for "([^"]*)" event with "([^"]*)"$/,
    async function(event, query) {
      await this.browser.fetch(`/apievents/${event}${query ? `?${query}` : ''}`);
      await this.waitForChange(500);
    }
  );

  this.Then(
    /^There are "([^"]*)" updated rows$/,
    function(count) {
      this.browser.assert.elements('tr.row-highlight', parseInt(count, 10));
    }
  );

  this.Then(/^the "([^"]*)" workflow has "([^"]*)" execs$/, function (name, execCount) {
    const row = findTableRow(this.browser, name);

    this.browser.assert.text(row.cells[3], execCount);
  });

  this.Then(
    /^the "([^"]*)" "([^"]*)" has "([^"]*)" "([^"]*)" instances$/,
    function(name, resource, count, column) {
      const row = findTableRow(this.browser, name, resource === 'job' ? 3 : 5);
      const cell = instanceColumns[resource][column];

      this.browser.assert.text(row.cells[cell], count);
    }
  );

  this.Then(/^there are "([^"]*)" "([^"]*)" connections$/, function (count, type) {
    const css = type === 'active' ? '.fa-check-circle' : '.fa-minus-circle';

    this.browser.assert.elements(`${cmpTable} ${css}`, parseInt(count, 10));
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
