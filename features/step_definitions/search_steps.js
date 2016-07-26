import { expect } from 'chai';

module.exports = function searchSteps() {
  this.Then(/^the search page is shown$/, async function() {
    await this.waitForElement('.workflows-toolbar');
    this.browser.assert.element('.workflows-toolbar');
  });

  this.Then(/^there are (\d+) inputs displayed$/, async function(count) {
    this.browser.assert.elements('input[type="text"]', parseInt(count, 10));
  });

  this.When(/^I search for "([^"]*)" by "([^"]*)"$/, async function(value, input) {
    this.browser.fill('#${input}', value);

    await this.waitForURLChange();

    console.log(this.browser.location.href);

    return this.browser.assert.url({ query: { ids: value } });
  });

  this.Then(/^"([^"]*)" value is "([^"]*)"$/, async function(input, value) {
    const val = this.browser.queryAll(`#${input}`)[0].value;

    return expect(val).to.eql(value);
  });
};
