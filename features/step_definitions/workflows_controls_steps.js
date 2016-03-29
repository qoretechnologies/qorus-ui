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
};
