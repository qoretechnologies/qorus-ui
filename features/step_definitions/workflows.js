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
};
