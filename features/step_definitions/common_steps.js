const mainSection = '.root__center > section';


module.exports = function commonSteps() {
  this.When(/^I activate "([^"]*)" navigation item$/, function(name) {
    const link = this.browser.
      queryAll('nav.side-menu li > a').
      find(link => (
        this.browser.query('.side-menu__text', link).textContent === name
      ));

    return this.browser.clickLink(link);
  });


  this.Then(/^I should see a loader$/, function() {
    this.browser.assert.text(`${mainSection} p`, 'Loading');
  });
};


module.exports.selectors = {
  mainSection,
};
