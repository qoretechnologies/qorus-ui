module.exports = function workflowBatchActionsSteps() {
  this.When(/^I select three workflows$/, async function () {
    const workflows = this.browser.queryAll('td.narrow > i.fa-square-o');

    this.browser.click(workflows[0]);
    this.browser.click(workflows[1]);
    this.browser.click(workflows[2]);
  });

  this.Then(/^there are "([^"]*)" "([^"]*)" workflows$/, async function(count, type) {
    const css = type === 'disabled' ? 'danger' : 'success';

    await this.waitForChange(3000);
    this.browser.assert.elements(`td.narrow .btn-${css} i.fa-power-off`, parseInt(count));
  });
};
