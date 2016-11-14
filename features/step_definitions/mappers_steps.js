module.exports = function mappersSteps() {
  this.Then(/^the mapper gets loaded$/, async function() {
    await this.waitForElement('#mapper');
  });

  this.Then(/^there are (\d+) mapper fields$/, async function(count) {
    this.browser.assert.elements('.mapper-label', parseInt(count, 10));
  });

  this.When(/^I click on show details$/, async function() {
    this.browser.click('.field-detail__showall');
  });

  this.Then(/^the detail panel is shown$/, async function() {
    this.browser.assert.element('.mapper-detail');
  });

  this.Then(/^there are table and code elements$/, async function() {
    this.browser.assert.element('.mapper-detail table');
    this.browser.assert.element('.mapper-detail .source-code');
  });

  this.Then(/^I see an error message$/, async function() {
    this.browser.assert.element('.alert.alert-danger');
  });
};
