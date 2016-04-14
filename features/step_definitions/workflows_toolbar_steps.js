const findElementByText = (browser, selector, text) => {
  return browser.
    queryAll(selector).
    find(el => el.textContent === text)
    || null;
};

module.exports = function workFlowControlSteps() {
  this.When(/^I click the dropdown toggle$/, function () {
    return this.browser.pressButton('#selection');
  });

  this.Then(/^the dropdown should be shown$/, function () {
    this.browser.assert.element('#selection-dropdown');
  });

  this.When(/^I blur the dropdown toggle$/, function () {
    return this.browser.pressButton('#selection');
  });

  this.Then(/^the dropdown should be hidden$/, function () {
    this.browser.assert.elements('#selection-dropdown', 0);
  });

  this.When(/^I click the checkbox on the dropdown$/, function () {
    this.browser.click('#selection .fa-square-o');
  });

  this.Then(/^all of the workflows are selected$/, function () {
    this.browser.assert.hasClass('td.narrow > i', 'fa-check-square-o');
  });

  this.When(/^I select one workflow$/, function () {
    this.browser.click('td.narrow > i.fa-square-o:first-of-type');
  });

  this.Then(/^the dropdown checkbox should be halfchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-minus-square-o');
  });

  this.When(/^I click the All item$/, function () {
    this.browser.click('#selection-dropdown > li > a:first-of-type');
  });

  this.When(/^I click the Invert item$/, function () {
    const el = findElementByText(this.browser, '#selection-dropdown > li > a', ' Invert');

    return this.browser.click(el);
  });

  this.When(/^I click the None item$/, function () {
    const el = findElementByText(this.browser, '#selection-dropdown > li > a', ' None');

    return this.browser.click(el);
  });

  this.Then(/^no workflows are selected$/, function () {
    this.browser.assert.hasClass('td.narrow > i', 'fa-square-o');
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.Then(/^the selection actions are displayed$/, function () {
    this.browser.assert.element('#selection-actions');
  });

  this.When(/^I deselect all workflows$/, function () {
    this.browser.click('td.narrow > i.fa-check-square-o');
  });

  this.Then(/^the dropdown checkbox should be unchecked$/, function () {
    this.browser.assert.hasClass('#selection > i', 'fa-square-o');
  });

  this.When(/^I click the Running button$/, async function() {
    const el = findElementByText(this.browser, '.btn > span', ' Running');

    return this.browser.click(el.parentElement);
  });

  this.Then(/^only one workflow is visible$/, async function() {
    this.browser.assert.elements('tbody > tr', 3);
  });

  this.When(/^I click the Deprecated button$/, async function() {
    this.browser.click('#deprecated');

    const el = findElementByText(this.browser, '#deprecated-dropdown span', 'Deprecated');

    return this.browser.click(el.parentElement);
  });

  this.Then(/^the hidden workflows are displayed$/, async function() {
    this.browser.assert.elements('tbody > tr', 5);
  });

  this.When(/^I click the Last Version button$/, async function() {
    const el = findElementByText(this.browser, '.btn > span', ' Last version');

    return this.browser.click(el.parentElement);
  });

  this.Then(/^only the last version of workflows are shown$/, async function() {
    this.browser.assert.elements('tbody > tr', 4);
  });
};
