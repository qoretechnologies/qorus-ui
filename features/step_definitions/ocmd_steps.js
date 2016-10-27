module.exports = function ocmdSteps() {
  this.Then(/^the ocmd page loads$/, async function() {
    await this.waitForElement('pre');

    this.browser.assert.element('pre');
  });

  this.Then(/^the command input says "([^"]*)"$/, async function(cmmd) {
    this.browser.assert.attribute('input[name=ocmd-command]', 'value', cmmd);
  });

  this.Then(/^the results for "([^"]*)" are loaded$/, async function(cmmd) {
    this.browser.assert.text('.ocmd-output h4', `Showing output for: ${cmmd}`);
  });

  this.When(/^I press the up key$/, async function() {
    await this.keyDown('input[name=ocmd-command]', 38);
  });

  this.Given(/^the command input has focus$/, async function() {
    this.browser.assert.hasFocus('input[name=ocmd-command]');
  });
};
